import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TypeEpreuve } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEpreuveDto } from './dto/create-epreuve.dto';
import { UpdateEpreuveDto } from './dto/update-epreuve.dto';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';

// Identité de l'appelant, extraite du token JWT par le contrôleur : id = Personne.id
// pour un enseignant, Eleve.id pour un élève, Admin.id pour un administrateur (voir
// AuthService.issueSession). Toutes les règles de propriété et de visibilité de ce
// service reposent sur cette identité, jamais sur une valeur envoyée dans le corps
// de la requête.
export interface Requester {
  id: number;
  role: string;
}

export interface FindAllEpreuvesParams {
  search?: string;
  idCours?: number;
  idClasse?: number;
  typeEpreuve?: TypeEpreuve;
  page?: number;
  limit?: number;
}

export interface FindAllEvaluationsParams {
  search?: string;
  idEleve?: number;
  idEpreuve?: number;
  idClasse?: number;
  page?: number;
  limit?: number;
}

// Une épreuve appartient toujours à une classe précise (Epreuve.idClasse) et,
// optionnellement, à un cours enseigné dans cette classe (Epreuve.idClasseCours,
// qui pointe vers la combinaison ClasseCours — jamais un idCours brut, pour ne pas
// pouvoir associer un cours qui n'est pas réellement enseigné dans cette classe).
// idEnseignant est la source de vérité explicite de "qui a créé cette épreuve" :
// jamais déduite indirectement d'idClasseCours (optionnel, donc pas fiable comme
// signal d'appartenance — c'est précisément la cause du bug diagnostiqué où une
// épreuve devenait invisible pour son propre créateur).
const EPREUVE_INCLUDE = {
  classe: { include: { cycle: true } },
  classeCours: {
    include: {
      cours: true,
      affectations: { include: { enseignant: { include: { personne: true } } } },
    },
  },
  enseignant: { include: { personne: true } },
};

const EVALUATION_INCLUDE = {
  epreuve: { include: EPREUVE_INCLUDE },
  eleve: true,
};

@Injectable()
export class EvaluationService {
  constructor(private prisma: PrismaService) {}

  private async assertClasseExiste(idClasse: number) {
    const classe = await this.prisma.classe.findUnique({ where: { id: idClasse } });
    if (!classe) throw new NotFoundException(`Classe #${idClasse} introuvable`);
  }

  // Si un cours est précisé, il doit vraiment être enseigné dans la classe de
  // l'épreuve : on vérifie que le ClasseCours choisi pointe bien vers cette classe,
  // pour ne jamais créer d'épreuve avec une paire cours/classe incohérente.
  private async assertClasseCoursCoherent(idClasseCours: number, idClasse: number) {
    const classeCours = await this.prisma.classeCours.findUnique({ where: { id: idClasseCours } });
    if (!classeCours) throw new NotFoundException(`Cours/classe #${idClasseCours} introuvable`);
    if (classeCours.idClasse !== idClasse) {
      throw new BadRequestException(
        "Le cours choisi n'est pas enseigné dans la classe sélectionnée pour cette épreuve.",
      );
    }
  }

  // Résout l'entité Enseignant à partir de l'identité du token (id = Personne.id).
  private async resolveEnseignant(requester: Requester) {
    const enseignant = await this.prisma.enseignant.findUnique({ where: { idPers: requester.id } });
    if (!enseignant) throw new ForbiddenException('Compte enseignant introuvable.');
    return enseignant;
  }

  private async assertEnseignantEnseigneCeCours(idEnseignantEntite: number, idClasseCours: number) {
    const affectation = await this.prisma.affectation.findUnique({
      where: { idEnseignant_idClasseCours: { idEnseignant: idEnseignantEntite, idClasseCours } },
    });
    if (!affectation) {
      throw new BadRequestException("Cet enseignant n'enseigne pas cette matière.");
    }
  }

  private async assertEleveDansClasse(idEleve: number, idClasse: number) {
    const eleve = await this.prisma.eleve.findUnique({ where: { id: idEleve } });
    if (!eleve) throw new NotFoundException(`Élève #${idEleve} introuvable`);

    const frequente = await this.prisma.frequente.findFirst({
      where: { idEleve, salle: { idClasse } },
    });
    if (!frequente) {
      throw new BadRequestException("Cet élève n'appartient pas à cette classe.");
    }
  }

  // Empêche deux épreuves identiques (même classe, même cours, même libellé, même
  // date) : ce n'est pas une contrainte d'unicité en base (idClasseCours étant
  // nullable, deux NULL ne s'y comparent jamais comme égaux), donc vérifiée ici.
  private async assertPasDoublonEpreuve(params: {
    idClasse: number;
    idClasseCours?: number | null;
    libelle: string;
    dateEpreuve: string | Date;
    excludeId?: number;
  }) {
    const existing = await this.prisma.epreuve.findFirst({
      where: {
        idClasse: params.idClasse,
        idClasseCours: params.idClasseCours ?? null,
        libelle: params.libelle.trim(),
        dateEpreuve: new Date(params.dateEpreuve),
        ...(params.excludeId ? { id: { not: params.excludeId } } : {}),
      },
    });
    if (existing) {
      throw new ConflictException('Cette épreuve existe déjà.');
    }
  }

  // Un enseignant ne peut agir que sur ses propres épreuves ; un administrateur
  // n'est jamais restreint.
  private async assertProprietaireEpreuve(
    epreuve: { idEnseignant: number | null },
    requester: Requester,
    action: string,
  ) {
    if (requester.role !== 'enseignant') return;
    const enseignant = await this.resolveEnseignant(requester);
    if (epreuve.idEnseignant !== enseignant.id) {
      throw new ForbiddenException(`Vous ne pouvez ${action} que vos propres épreuves.`);
    }
  }

  private assertEleveEstRequester(idEleve: number, requester?: Requester) {
    if (requester?.role === 'eleve' && requester.id !== idEleve) {
      throw new ForbiddenException('Vous ne pouvez consulter que vos propres notes.');
    }
  }

  // ── Epreuve ──────────────────────────────────────────────────────
  // Un enseignant doit obligatoirement préciser le cours concerné (idClasseCours) :
  // c'est ce qui permet de vérifier qu'il enseigne bien cette matière dans cette
  // classe, et c'est la donnée qui garantit que l'épreuve reste visible pour lui
  // ensuite (idEnseignant en est dérivé, jamais laissé vide pour un enseignant).
  // Un administrateur peut créer une épreuve plus générale (idClasseCours facultatif).
  async createEpreuve(dto: CreateEpreuveDto, requester: Requester) {
    await this.assertClasseExiste(dto.idClasse);

    let idEnseignant: number | undefined;
    let idAdmin: number | undefined;

    if (requester.role === 'enseignant') {
      if (!dto.idClasseCours) {
        throw new BadRequestException('Vous devez préciser le cours concerné par cette épreuve.');
      }
      await this.assertClasseCoursCoherent(dto.idClasseCours, dto.idClasse);
      const enseignant = await this.resolveEnseignant(requester);
      await this.assertEnseignantEnseigneCeCours(enseignant.id, dto.idClasseCours);
      idEnseignant = enseignant.id;
    } else {
      if (dto.idClasseCours) {
        await this.assertClasseCoursCoherent(dto.idClasseCours, dto.idClasse);
      }
      if (dto.idEnseignant) {
        if (!dto.idClasseCours) {
          throw new BadRequestException("Précisez le cours pour pouvoir assigner l'épreuve à un enseignant.");
        }
        await this.assertEnseignantEnseigneCeCours(dto.idEnseignant, dto.idClasseCours);
        idEnseignant = dto.idEnseignant;
      }
      idAdmin = dto.idAdmin ?? requester.id;
    }

    await this.assertPasDoublonEpreuve({
      idClasse: dto.idClasse,
      idClasseCours: dto.idClasseCours,
      libelle: dto.libelle,
      dateEpreuve: dto.dateEpreuve,
    });

    const { idEnseignant: _ignoredEns, idAdmin: _ignoredAdmin, ...rest } = dto;

    return this.prisma.epreuve.create({
      data: { ...rest, idEnseignant, idAdmin },
      include: EPREUVE_INCLUDE,
    });
  }

  // Pagination optionnelle : un formulaire de saisie de note a besoin de la liste
  // complète des épreuves pour son menu déroulant, la page d'administration des
  // épreuves a besoin d'une liste paginée. On ne pagine que si page/limit sont
  // fournis (même logique que pour le module Cours).
  //
  // Quand l'appelant est un enseignant, la liste est systématiquement restreinte à
  // ses propres épreuves (idEnseignant), côté serveur — jamais laissée au frontend
  // de le déduire lui-même à partir d'un champ optionnel.
  async findAllEpreuves(params: FindAllEpreuvesParams = {}, requester?: Requester) {
    let idEnseignantFilter: number | undefined;
    if (requester?.role === 'enseignant') {
      const enseignant = await this.resolveEnseignant(requester);
      idEnseignantFilter = enseignant.id;
    }

    const where = {
      ...(params.search ? { libelle: { contains: params.search } } : {}),
      ...(params.typeEpreuve ? { typeEpreuve: params.typeEpreuve } : {}),
      ...(params.idClasse ? { idClasse: params.idClasse } : {}),
      ...(params.idCours ? { classeCours: { idCours: params.idCours } } : {}),
      ...(idEnseignantFilter ? { idEnseignant: idEnseignantFilter } : {}),
    };

    const shouldPaginate = params.page !== undefined || params.limit !== undefined;

    if (!shouldPaginate) {
      return this.prisma.epreuve.findMany({
        where,
        include: EPREUVE_INCLUDE,
        orderBy: { dateEpreuve: 'desc' },
      });
    }

    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 20;

    const [data, total] = await Promise.all([
      this.prisma.epreuve.findMany({
        where,
        include: EPREUVE_INCLUDE,
        orderBy: { dateEpreuve: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.epreuve.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  // requester fourni => vérifie le droit de consultation (utilisé par le
  // contrôleur) ; omis => lecture interne "brute", utilisée par les autres
  // méthodes de ce service qui font leur propre vérification explicite ensuite.
  async findOneEpreuve(id: number, requester?: Requester) {
    const epreuve = await this.prisma.epreuve.findUnique({
      where: { id },
      include: {
        ...EPREUVE_INCLUDE,
        evaluations: {
          include: { eleve: true },
          orderBy: [{ rang: 'asc' }, { note: 'desc' }],
        },
      },
    });
    if (!epreuve) throw new NotFoundException(`Epreuve #${id} introuvable`);
    if (requester) await this.assertProprietaireEpreuve(epreuve, requester, 'consulter');
    return epreuve;
  }

  async updateEpreuve(id: number, dto: UpdateEpreuveDto, requester: Requester) {
    const existing = await this.findOneEpreuve(id);
    await this.assertProprietaireEpreuve(existing, requester, 'modifier');

    if (dto.idClasse) await this.assertClasseExiste(dto.idClasse);

    const idClasse = dto.idClasse ?? existing.idClasse;
    const idClasseCours = dto.idClasseCours !== undefined ? dto.idClasseCours : existing.idClasseCours;

    if (requester.role === 'enseignant' && !idClasseCours) {
      throw new BadRequestException('Vous devez préciser le cours concerné par cette épreuve.');
    }
    if (idClasseCours) {
      await this.assertClasseCoursCoherent(idClasseCours, idClasse);
    }

    let idEnseignant = existing.idEnseignant;
    if (requester.role === 'enseignant') {
      const enseignant = await this.resolveEnseignant(requester);
      if (idClasseCours) await this.assertEnseignantEnseigneCeCours(enseignant.id, idClasseCours);
      idEnseignant = enseignant.id;
    } else if (dto.idEnseignant !== undefined) {
      if (dto.idEnseignant && idClasseCours) {
        await this.assertEnseignantEnseigneCeCours(dto.idEnseignant, idClasseCours);
      }
      idEnseignant = dto.idEnseignant ?? null;
    }

    if (dto.libelle !== undefined || dto.dateEpreuve !== undefined || dto.idClasse !== undefined || dto.idClasseCours !== undefined) {
      await this.assertPasDoublonEpreuve({
        idClasse,
        idClasseCours,
        libelle: dto.libelle ?? existing.libelle,
        dateEpreuve: dto.dateEpreuve ?? existing.dateEpreuve,
        excludeId: id,
      });
    }

    const { idEnseignant: _ignoredEns, idAdmin: _ignoredAdmin, ...rest } = dto;

    return this.prisma.epreuve.update({
      where: { id },
      data: { ...rest, idEnseignant },
      include: EPREUVE_INCLUDE,
    });
  }

  async deleteEpreuve(id: number, requester: Requester) {
    const existing = await this.findOneEpreuve(id);
    await this.assertProprietaireEpreuve(existing, requester, 'supprimer');
    return this.prisma.epreuve.delete({ where: { id } });
  }

  // Statistiques de classe pour une épreuve donnée (moyenne, min, max) : calculée
  // à partir des notes déjà stockées, aucune donnée supplémentaire requise.
  async getStatsEpreuve(id: number, requester?: Requester) {
    const epreuve = await this.findOneEpreuve(id, requester);
    const notes = epreuve.evaluations
      .map((evaluation) => evaluation.note)
      .filter((note): note is number => note !== null && note !== undefined);

    const moyenneClasse = notes.length
      ? notes.reduce((sum, note) => sum + note, 0) / notes.length
      : null;

    return {
      idEpreuve: id,
      noteMax: epreuve.noteMax,
      moyenneClasse,
      meilleureNote: notes.length ? Math.max(...notes) : null,
      moinsBonneNote: notes.length ? Math.min(...notes) : null,
      nombreNotes: notes.length,
      nombreEleves: epreuve.evaluations.length,
    };
  }

  // ── Evaluation (notes) ───────────────────────────────────────────
  private assertNoteValide(note: number | undefined | null, noteMax: number) {
    if (note === undefined || note === null) return;
    if (note > noteMax) {
      throw new BadRequestException(
        `La note (${note}) ne peut pas dépasser la note maximale de l'épreuve (${noteMax}).`,
      );
    }
  }

  async createEvaluation(dto: CreateEvaluationDto, requester: Requester) {
    const epreuve = await this.findOneEpreuve(dto.idEpreuve);
    await this.assertProprietaireEpreuve(epreuve, requester, 'noter');
    this.assertNoteValide(dto.note, epreuve.noteMax);
    await this.assertEleveDansClasse(dto.idEleve, epreuve.idClasse);

    const dejaNote = await this.prisma.evaluation.findUnique({
      where: { idEpreuve_idEleve: { idEpreuve: dto.idEpreuve, idEleve: dto.idEleve } },
    });
    if (dejaNote) {
      throw new ConflictException(
        "Cet élève a déjà une note pour cette épreuve. Modifiez la note existante plutôt que d'en créer une nouvelle.",
      );
    }

    const idAdmin = requester.role === 'admin' ? requester.id : undefined;

    const evaluation = await this.prisma.evaluation.create({
      data: { ...dto, idAdmin },
      include: EVALUATION_INCLUDE,
    });

    await this.recomputeRangs(dto.idEpreuve);
    return this.findOneEvaluation(evaluation.id);
  }

  // Quand l'appelant est un élève, idEleve est toujours forcé à sa propre identité
  // (jamais laissé au choix du paramètre de requête). Quand c'est un enseignant,
  // la liste est restreinte à ses propres épreuves.
  async findAllEvaluations(params: FindAllEvaluationsParams = {}, requester?: Requester) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 20;

    const where: Record<string, unknown> = {};

    if (requester?.role === 'eleve') {
      where.idEleve = requester.id;
    } else if (params.idEleve) {
      where.idEleve = params.idEleve;
    }

    if (params.idEpreuve) where.idEpreuve = params.idEpreuve;

    const epreuveWhere: Record<string, unknown> = {};
    if (params.idClasse) epreuveWhere.idClasse = params.idClasse;
    if (requester?.role === 'enseignant') {
      const enseignant = await this.resolveEnseignant(requester);
      epreuveWhere.idEnseignant = enseignant.id;
    }
    if (Object.keys(epreuveWhere).length > 0) where.epreuve = epreuveWhere;

    if (params.search) {
      where.OR = [
        { eleve: { nom: { contains: params.search } } },
        { eleve: { prenom: { contains: params.search } } },
        { epreuve: { libelle: { contains: params.search } } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.evaluation.findMany({
        where,
        include: EVALUATION_INCLUDE,
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.evaluation.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findOneEvaluation(id: number, requester?: Requester) {
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { id },
      include: EVALUATION_INCLUDE,
    });
    if (!evaluation) throw new NotFoundException(`Evaluation #${id} introuvable`);
    if (requester) {
      this.assertEleveEstRequester(evaluation.idEleve, requester);
      await this.assertProprietaireEpreuve(evaluation.epreuve, requester, 'consulter');
    }
    return evaluation;
  }

  async updateEvaluation(id: number, dto: UpdateEvaluationDto, requester: Requester) {
    const existing = await this.findOneEvaluation(id);
    await this.assertProprietaireEpreuve(existing.epreuve, requester, 'modifier');

    const epreuve = dto.idEpreuve ? await this.findOneEpreuve(dto.idEpreuve) : existing.epreuve;
    if (dto.idEpreuve) await this.assertProprietaireEpreuve(epreuve, requester, 'modifier');
    this.assertNoteValide(dto.note, epreuve.noteMax);

    const idEleve = dto.idEleve ?? existing.idEleve;
    if (dto.idEleve || dto.idEpreuve) {
      await this.assertEleveDansClasse(idEleve, epreuve.idClasse);
    }

    await this.prisma.evaluation.update({ where: { id }, data: dto });
    await this.recomputeRangs(dto.idEpreuve ?? existing.idEpreuve);

    return this.findOneEvaluation(id);
  }

  async deleteEvaluation(id: number, requester: Requester) {
    const existing = await this.findOneEvaluation(id);
    await this.assertProprietaireEpreuve(existing.epreuve, requester, 'supprimer');
    await this.prisma.evaluation.delete({ where: { id } });
    await this.recomputeRangs(existing.idEpreuve);
    return existing;
  }

  // Classement automatique (rang) des élèves pour une épreuve, recalculé à chaque
  // création/modification/suppression de note. Classement standard "1-2-2-4" :
  // les ex-aequo partagent le même rang, le rang suivant tient compte du nombre
  // d'élèves déjà classés.
  private async recomputeRangs(idEpreuve: number) {
    const evaluations = await this.prisma.evaluation.findMany({
      where: { idEpreuve, note: { not: null } },
      orderBy: { note: 'desc' },
    });

    let rang = 0;
    let previousNote: number | null = null;
    let position = 0;

    for (const evaluation of evaluations) {
      position += 1;
      if (evaluation.note !== previousNote) {
        rang = position;
        previousNote = evaluation.note;
      }
      await this.prisma.evaluation.update({
        where: { id: evaluation.id },
        data: { rang },
      });
    }
  }

  // Moyenne pondérée (par le coefficient de chaque épreuve) d'un élève sur un cours.
  async getMoyenneEleveCours(idEleve: number, idCours: number, requester?: Requester) {
    this.assertEleveEstRequester(idEleve, requester);
    await this.prisma.eleve.findUniqueOrThrow({ where: { id: idEleve } });
    await this.prisma.cours.findUniqueOrThrow({ where: { id: idCours } });

    const evaluations = await this.prisma.evaluation.findMany({
      where: { idEleve, note: { not: null }, epreuve: { classeCours: { idCours } } },
      include: { epreuve: true },
    });

    const totalCoefficients = evaluations.reduce((sum, e) => sum + e.epreuve.coefficient, 0);
    const totalPondere = evaluations.reduce(
      (sum, e) => sum + (e.note as number) * e.epreuve.coefficient,
      0,
    );

    return {
      idEleve,
      idCours,
      moyenne: totalCoefficients > 0 ? totalPondere / totalCoefficients : null,
      nombreEvaluations: evaluations.length,
    };
  }

  // Bulletin d'un élève : moyenne par cours puis moyenne générale pondérée par le
  // coefficient de chaque cours. Entièrement dérivé des données existantes.
  async getBulletinEleve(idEleve: number, requester?: Requester) {
    this.assertEleveEstRequester(idEleve, requester);
    await this.prisma.eleve.findUniqueOrThrow({ where: { id: idEleve } });

    const evaluations = await this.prisma.evaluation.findMany({
      where: { idEleve, note: { not: null } },
      include: { epreuve: { include: { classeCours: { include: { cours: true } } } } },
    });

    const parCoursMap = new Map<
      number,
      { libelle: string; coefficientCours: number; totalPondere: number; totalCoefficients: number; nombreEvaluations: number }
    >();

    for (const evaluation of evaluations) {
      const cours = evaluation.epreuve.classeCours?.cours;
      if (!cours) continue;

      const entry = parCoursMap.get(cours.id) ?? {
        libelle: cours.libelle,
        coefficientCours: cours.coefficient,
        totalPondere: 0,
        totalCoefficients: 0,
        nombreEvaluations: 0,
      };

      entry.totalPondere += (evaluation.note as number) * evaluation.epreuve.coefficient;
      entry.totalCoefficients += evaluation.epreuve.coefficient;
      entry.nombreEvaluations += 1;
      parCoursMap.set(cours.id, entry);
    }

    const parCours = Array.from(parCoursMap.entries()).map(([idCours, entry]) => ({
      idCours,
      libelleCours: entry.libelle,
      coefficientCours: entry.coefficientCours,
      moyenne: entry.totalCoefficients > 0 ? entry.totalPondere / entry.totalCoefficients : null,
      nombreEvaluations: entry.nombreEvaluations,
    }));

    const coursAvecMoyenne = parCours.filter((c) => c.moyenne !== null);
    const totalCoefficientsGenerale = coursAvecMoyenne.reduce((sum, c) => sum + c.coefficientCours, 0);
    const totalPondereGenerale = coursAvecMoyenne.reduce(
      (sum, c) => sum + (c.moyenne as number) * c.coefficientCours,
      0,
    );

    return {
      idEleve,
      moyenneGenerale: totalCoefficientsGenerale > 0 ? totalPondereGenerale / totalCoefficientsGenerale : null,
      parCours,
    };
  }
}
