import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmploiDeTempsDto } from './dto/create-emploi-de-temps.dto';
import { UpdateEmploiDeTempsDto } from './dto/update-emploi-de-temps.dto';

export interface FindAllEmploiParams {
  idClasse?: number;
  idCours?: number;
  idEnseignant?: number;
  idSalle?: number;
  jour?: string;
  page?: number;
  limit?: number;
}

// Un créneau pointe vers une Affectation (enseignant + cours + classe déjà
// validés ensemble) : ce include suffit à retrouver classe, cours, enseignant
// et salle en une seule requête.
const EMPLOI_INCLUDE = {
  affectation: {
    include: {
      enseignant: { include: { personne: true } },
      classeCours: {
        include: {
          classe: { include: { cycle: true } },
          cours: true,
        },
      },
    },
  },
  salle: true,
} as const;

type RawEmploi = {
  id: number;
  jour: string;
  heureDebut: string;
  heureFin: string;
  idSalle: number | null;
  actif: boolean;
  idAdmin: number | null;
  created_at: Date;
  updated_at: Date;
  affectation: {
    id: number;
    idEnseignant: number;
    enseignant: unknown;
    classeCours: {
      idClasse: number;
      idCours: number;
      classe: unknown;
      cours: unknown;
    };
  };
  salle: unknown;
};

// On aplatit la réponse (classe/cours/enseignant remontés au premier niveau) pour
// que le frontend n'ait pas à connaître le détail de la modélisation interne —
// il continue de lire emploi.classe / emploi.cours comme avant, avec en plus
// emploi.enseignant.
function mapEmploi(raw: RawEmploi) {
  const { affectation, ...rest } = raw;
  return {
    ...rest,
    idClasse: affectation.classeCours.idClasse,
    idCours: affectation.classeCours.idCours,
    idEnseignant: affectation.idEnseignant,
    idAffectation: affectation.id,
    classe: affectation.classeCours.classe,
    cours: affectation.classeCours.cours,
    enseignant: affectation.enseignant,
  };
}

@Injectable()
export class EmploiDeTempsService {
  constructor(private prisma: PrismaService) {}

  private timeOverlap(startA: string, endA: string, startB: string, endB: string) {
    return startA < endB && endA > startB;
  }

  private assertHorairesValides(heureDebut: string, heureFin: string) {
    if (heureDebut >= heureFin) {
      throw new BadRequestException(
        "Les horaires saisis sont invalides : l'heure de fin doit être strictement après l'heure de début.",
      );
    }
  }

  // Résout et valide en une fois les trois règles de cohérence métier :
  // - la classe et le cours existent ;
  // - ce cours est bien affecté à cette classe (ClasseCours) ;
  // - cet enseignant enseigne bien ce cours dans cette classe (Affectation).
  // Retourne l'Affectation correspondante, seule donnée réellement persistée.
  private async resolveAffectation(idClasse: number, idCours: number, idEnseignant: number) {
    const classe = await this.prisma.classe.findUnique({ where: { id: idClasse } });
    if (!classe) throw new NotFoundException(`Classe #${idClasse} introuvable`);

    const cours = await this.prisma.cours.findUnique({ where: { id: idCours } });
    if (!cours) throw new NotFoundException(`Cours #${idCours} introuvable`);

    const classeCours = await this.prisma.classeCours.findUnique({
      where: { idClasse_idCours: { idClasse, idCours } },
    });
    if (!classeCours) {
      throw new BadRequestException("Cette matière n'est pas affectée à cette classe.");
    }

    const enseignant = await this.prisma.enseignant.findUnique({ where: { id: idEnseignant } });
    if (!enseignant) throw new NotFoundException(`Enseignant #${idEnseignant} introuvable`);

    const affectation = await this.prisma.affectation.findUnique({
      where: { idEnseignant_idClasseCours: { idEnseignant, idClasseCours: classeCours.id } },
    });
    if (!affectation) {
      throw new BadRequestException("Cet enseignant n'enseigne pas cette matière.");
    }

    return affectation;
  }

  private async assertNoConflict(params: {
    jour: string;
    heureDebut: string;
    heureFin: string;
    idClasse: number;
    idEnseignant: number;
    idSalle?: number;
    excludeId?: number;
  }) {
    const candidates = await this.prisma.emploiDuTemps.findMany({
      where: {
        jour: params.jour,
        ...(params.excludeId ? { id: { not: params.excludeId } } : {}),
        OR: [
          { affectation: { classeCours: { idClasse: params.idClasse } } },
          { affectation: { idEnseignant: params.idEnseignant } },
          ...(params.idSalle ? [{ idSalle: params.idSalle }] : []),
        ],
      },
      include: { affectation: { include: { classeCours: true } } },
    });

    for (const existing of candidates) {
      if (!this.timeOverlap(params.heureDebut, params.heureFin, existing.heureDebut, existing.heureFin)) {
        continue;
      }

      if (existing.affectation.classeCours.idClasse === params.idClasse) {
        throw new ConflictException(
          `Cette classe possède déjà un cours pendant cette plage horaire (${existing.heureDebut} - ${existing.heureFin}).`,
        );
      }
      if (existing.affectation.idEnseignant === params.idEnseignant) {
        throw new ConflictException(
          `Cet enseignant est déjà occupé sur un autre cours pendant cette plage horaire (${existing.heureDebut} - ${existing.heureFin}).`,
        );
      }
      if (params.idSalle && existing.idSalle === params.idSalle) {
        throw new ConflictException(
          `La salle est déjà occupée pendant cette plage horaire (${existing.heureDebut} - ${existing.heureFin}).`,
        );
      }
    }
  }

  private async assertSalleExiste(idSalle?: number) {
    if (!idSalle) return;
    const salle = await this.prisma.salle.findUnique({ where: { id: idSalle } });
    if (!salle) throw new NotFoundException(`Salle #${idSalle} introuvable`);
  }

  async create(dto: CreateEmploiDeTempsDto) {
    this.assertHorairesValides(dto.heureDebut, dto.heureFin);
    const affectation = await this.resolveAffectation(dto.idClasse, dto.idCours, dto.idEnseignant);
    await this.assertSalleExiste(dto.idSalle);
    await this.assertNoConflict({
      jour: dto.jour,
      heureDebut: dto.heureDebut,
      heureFin: dto.heureFin,
      idClasse: dto.idClasse,
      idEnseignant: dto.idEnseignant,
      idSalle: dto.idSalle,
    });

    const created = await this.prisma.emploiDuTemps.create({
      data: {
        jour: dto.jour,
        heureDebut: dto.heureDebut,
        heureFin: dto.heureFin,
        idAffectation: affectation.id,
        idSalle: dto.idSalle,
        actif: dto.actif,
        idAdmin: dto.idAdmin,
      },
      include: EMPLOI_INCLUDE,
    });

    return mapEmploi(created);
  }

  async findAll(params: FindAllEmploiParams = {}) {
    const where = {
      ...(params.idClasse ? { affectation: { classeCours: { idClasse: params.idClasse } } } : {}),
      ...(params.idCours ? { affectation: { classeCours: { idCours: params.idCours } } } : {}),
      ...(params.idEnseignant ? { affectation: { idEnseignant: params.idEnseignant } } : {}),
      ...(params.idSalle ? { idSalle: params.idSalle } : {}),
      ...(params.jour ? { jour: params.jour } : {}),
    };

    const shouldPaginate = params.page !== undefined || params.limit !== undefined;

    if (!shouldPaginate) {
      const data = await this.prisma.emploiDuTemps.findMany({
        where,
        include: EMPLOI_INCLUDE,
        orderBy: [{ jour: 'asc' }, { heureDebut: 'asc' }],
      });
      return data.map(mapEmploi);
    }

    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 20;

    const [data, total] = await Promise.all([
      this.prisma.emploiDuTemps.findMany({
        where,
        include: EMPLOI_INCLUDE,
        orderBy: [{ jour: 'asc' }, { heureDebut: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.emploiDuTemps.count({ where }),
    ]);

    return {
      data: data.map(mapEmploi),
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findOne(id: number) {
    const emploi = await this.prisma.emploiDuTemps.findUnique({
      where: { id },
      include: EMPLOI_INCLUDE,
    });
    if (!emploi) throw new NotFoundException(`Créneau #${id} introuvable`);
    return mapEmploi(emploi);
  }

  async update(id: number, dto: UpdateEmploiDeTempsDto) {
    const existing = await this.findOne(id);

    const idClasse = dto.idClasse ?? existing.idClasse;
    const idCours = dto.idCours ?? existing.idCours;
    const idEnseignant = dto.idEnseignant ?? existing.idEnseignant;
    const jour = dto.jour ?? existing.jour;
    const heureDebut = dto.heureDebut ?? existing.heureDebut;
    const heureFin = dto.heureFin ?? existing.heureFin;
    const idSalle = dto.idSalle !== undefined ? dto.idSalle : (existing.idSalle ?? undefined);

    this.assertHorairesValides(heureDebut, heureFin);
    const affectation = await this.resolveAffectation(idClasse, idCours, idEnseignant);
    await this.assertSalleExiste(idSalle);
    await this.assertNoConflict({ jour, heureDebut, heureFin, idClasse, idEnseignant, idSalle, excludeId: id });

    const updated = await this.prisma.emploiDuTemps.update({
      where: { id },
      data: {
        jour,
        heureDebut,
        heureFin,
        idAffectation: affectation.id,
        idSalle: idSalle ?? null,
        ...(dto.actif !== undefined ? { actif: dto.actif } : {}),
      },
      include: EMPLOI_INCLUDE,
    });

    return mapEmploi(updated);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.emploiDuTemps.delete({ where: { id } });
  }

  // Vue "emploi du temps classe" : tous les créneaux de la classe, triés jour/heure.
  async getGrilleClasse(idClasse: number) {
    const classe = await this.prisma.classe.findUnique({ where: { id: idClasse } });
    if (!classe) throw new NotFoundException(`Classe #${idClasse} introuvable`);

    const data = await this.prisma.emploiDuTemps.findMany({
      where: { affectation: { classeCours: { idClasse } } },
      include: EMPLOI_INCLUDE,
      orderBy: [{ jour: 'asc' }, { heureDebut: 'asc' }],
    });
    return data.map(mapEmploi);
  }

  // Vue "emploi du temps enseignant" : tous les créneaux où cet enseignant est
  // explicitement programmé (relation directe désormais, plus de reconstruction
  // via des paires cours/classe).
  async getGrilleEnseignant(idPers: number) {
    const enseignant = await this.prisma.enseignant.findUnique({ where: { idPers } });
    if (!enseignant) throw new NotFoundException(`Aucun enseignant pour la personne #${idPers}`);

    const data = await this.prisma.emploiDuTemps.findMany({
      where: { affectation: { idEnseignant: enseignant.id } },
      include: EMPLOI_INCLUDE,
      orderBy: [{ jour: 'asc' }, { heureDebut: 'asc' }],
    });
    return data.map(mapEmploi);
  }

  // Vue "emploi du temps élève" : via sa salle principale (Frequente -> Salle -> Classe),
  // même mécanisme que le module Classes (pas de nouvelle relation).
  async getGrilleEleve(idEleve: number) {
    const eleve = await this.prisma.eleve.findUnique({ where: { id: idEleve } });
    if (!eleve) throw new NotFoundException(`Eleve #${idEleve} introuvable`);

    const frequente = await this.prisma.frequente.findFirst({
      where: { idEleve },
      include: { salle: true },
    });
    if (!frequente || !frequente.salle.idClasse) {
      return [];
    }

    const data = await this.prisma.emploiDuTemps.findMany({
      where: { affectation: { classeCours: { idClasse: frequente.salle.idClasse } } },
      include: EMPLOI_INCLUDE,
      orderBy: [{ jour: 'asc' }, { heureDebut: 'asc' }],
    });
    return data.map(mapEmploi);
  }
}
