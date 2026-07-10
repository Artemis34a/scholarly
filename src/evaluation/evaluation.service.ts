import { Injectable, NotFoundException } from '@nestjs/common';
import { TypeEpreuve } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEpreuveDto } from './dto/create-epreuve.dto';
import { UpdateEpreuveDto } from './dto/update-epreuve.dto';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';

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

// Relations déjà présentes dans schema.prisma, exposées ici via include (aucune
// nouvelle relation créée) :
//   Evaluation -> Epreuve -> Cours -> Classe, Cours <- Enseignant[]
//   Evaluation -> Eleve
const EPREUVE_INCLUDE = {
  cours: { include: { classe: true, enseignants: { include: { personne: true } } } },
};

const EVALUATION_INCLUDE = {
  epreuve: { include: EPREUVE_INCLUDE },
  eleve: true,
};

@Injectable()
export class EvaluationService {
  constructor(private prisma: PrismaService) {}

  // ── Epreuve ──────────────────────────────────────────────────────
  async createEpreuve(dto: CreateEpreuveDto, idAdmin?: number) {
    if (dto.idCours) {
      await this.prisma.cours.findUniqueOrThrow({
        where: { id: dto.idCours },
      });
    }
    return this.prisma.epreuve.create({
      data: { ...dto, idAdmin },
      include: EPREUVE_INCLUDE,
    });
  }

  // Pagination optionnelle : un formulaire de saisie de note a besoin de la liste
  // complète des épreuves pour son menu déroulant, la page d'administration des
  // épreuves a besoin d'une liste paginée. On ne pagine que si page/limit sont
  // fournis (même logique que pour le module Cours).
  async findAllEpreuves(params: FindAllEpreuvesParams = {}) {
    const where = {
      ...(params.search ? { libelle: { contains: params.search } } : {}),
      ...(params.typeEpreuve ? { typeEpreuve: params.typeEpreuve } : {}),
      ...(params.idCours ? { idCours: params.idCours } : {}),
      ...(params.idClasse ? { cours: { idClasse: params.idClasse } } : {}),
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

  async findOneEpreuve(id: number) {
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
    return epreuve;
  }

  async updateEpreuve(id: number, dto: UpdateEpreuveDto) {
    await this.findOneEpreuve(id);
    if (dto.idCours) {
      await this.prisma.cours.findUniqueOrThrow({ where: { id: dto.idCours } });
    }
    return this.prisma.epreuve.update({ where: { id }, data: dto, include: EPREUVE_INCLUDE });
  }

  async deleteEpreuve(id: number) {
    await this.findOneEpreuve(id);
    return this.prisma.epreuve.delete({ where: { id } });
  }

  // Statistiques de classe pour une épreuve donnée (moyenne, min, max) : calculée
  // à partir des notes déjà stockées, aucune donnée supplémentaire requise.
  async getStatsEpreuve(id: number) {
    const epreuve = await this.findOneEpreuve(id);
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
  async createEvaluation(dto: CreateEvaluationDto, idAdmin?: number) {
    await this.findOneEpreuve(dto.idEpreuve);

    await this.prisma.eleve.findUniqueOrThrow({
      where: { id: dto.idEleve },
    });

    const evaluation = await this.prisma.evaluation.create({
      data: { ...dto, idAdmin },
      include: EVALUATION_INCLUDE,
    });

    await this.recomputeRangs(dto.idEpreuve);
    return this.findOneEvaluation(evaluation.id);
  }

  async findAllEvaluations(params: FindAllEvaluationsParams = {}) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 20;

    const where = {
      ...(params.idEleve ? { idEleve: params.idEleve } : {}),
      ...(params.idEpreuve ? { idEpreuve: params.idEpreuve } : {}),
      ...(params.idClasse ? { epreuve: { cours: { idClasse: params.idClasse } } } : {}),
      ...(params.search
        ? {
            OR: [
              { eleve: { nom: { contains: params.search } } },
              { eleve: { prenom: { contains: params.search } } },
              { epreuve: { libelle: { contains: params.search } } },
            ],
          }
        : {}),
    };

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

  async findOneEvaluation(id: number) {
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { id },
      include: EVALUATION_INCLUDE,
    });
    if (!evaluation)
      throw new NotFoundException(`Evaluation #${id} introuvable`);
    return evaluation;
  }

  async updateEvaluation(id: number, dto: UpdateEvaluationDto) {
    const existing = await this.findOneEvaluation(id);

    if (dto.idEpreuve) await this.findOneEpreuve(dto.idEpreuve);
    if (dto.idEleve) {
      await this.prisma.eleve.findUniqueOrThrow({ where: { id: dto.idEleve } });
    }

    await this.prisma.evaluation.update({ where: { id }, data: dto });
    await this.recomputeRangs(dto.idEpreuve ?? existing.idEpreuve);

    return this.findOneEvaluation(id);
  }

  async deleteEvaluation(id: number) {
    const existing = await this.findOneEvaluation(id);
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
  async getMoyenneEleveCours(idEleve: number, idCours: number) {
    await this.prisma.eleve.findUniqueOrThrow({ where: { id: idEleve } });
    await this.prisma.cours.findUniqueOrThrow({ where: { id: idCours } });

    const evaluations = await this.prisma.evaluation.findMany({
      where: { idEleve, note: { not: null }, epreuve: { idCours } },
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
  async getBulletinEleve(idEleve: number) {
    await this.prisma.eleve.findUniqueOrThrow({ where: { id: idEleve } });

    const evaluations = await this.prisma.evaluation.findMany({
      where: { idEleve, note: { not: null } },
      include: { epreuve: { include: { cours: true } } },
    });

    const parCoursMap = new Map<
      number,
      { libelle: string; coefficientCours: number; totalPondere: number; totalCoefficients: number; nombreEvaluations: number }
    >();

    for (const evaluation of evaluations) {
      const cours = evaluation.epreuve.cours;
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
