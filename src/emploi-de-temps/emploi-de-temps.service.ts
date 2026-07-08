import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmploiDeTempsDto } from './dto/create-emploi-de-temps.dto';
import { UpdateEmploiDeTempsDto } from './dto/update-emploi-de-temps.dto';

export interface FindAllEmploiParams {
  idClasse?: number;
  idCours?: number;
  idSalle?: number;
  jour?: string;
  page?: number;
  limit?: number;
}

const EMPLOI_INCLUDE = {
  classe: { include: { cycle: true } },
  cours: { include: { enseignants: { include: { personne: true } } } },
  salle: true,
};

@Injectable()
export class EmploiDeTempsService {
  constructor(private prisma: PrismaService) {}

  private timeOverlap(startA: string, endA: string, startB: string, endB: string) {
    return startA < endB && endA > startB;
  }

  private async assertValid(dto: { idClasse: number; idCours: number; idSalle?: number; heureDebut: string; heureFin: string }) {
    if (dto.heureDebut >= dto.heureFin) {
      throw new BadRequestException("L'heure de fin doit être après l'heure de début.");
    }

    const classe = await this.prisma.classe.findUnique({ where: { id: dto.idClasse } });
    if (!classe) throw new NotFoundException(`Classe #${dto.idClasse} introuvable`);

    const cours = await this.prisma.cours.findUnique({ where: { id: dto.idCours } });
    if (!cours) throw new NotFoundException(`Cours #${dto.idCours} introuvable`);

    if (dto.idSalle) {
      const salle = await this.prisma.salle.findUnique({ where: { id: dto.idSalle } });
      if (!salle) throw new NotFoundException(`Salle #${dto.idSalle} introuvable`);
    }
  }

  private async assertNoConflict(params: {
    jour: string;
    heureDebut: string;
    heureFin: string;
    idClasse: number;
    idSalle?: number;
    excludeId?: number;
  }) {
    const candidates = await this.prisma.emploiDuTemps.findMany({
      where: {
        jour: params.jour,
        ...(params.excludeId ? { id: { not: params.excludeId } } : {}),
        OR: [
          { idClasse: params.idClasse },
          ...(params.idSalle ? [{ idSalle: params.idSalle }] : []),
        ],
      },
    });

    for (const existing of candidates) {
      if (!this.timeOverlap(params.heureDebut, params.heureFin, existing.heureDebut, existing.heureFin)) {
        continue;
      }
      if (existing.idClasse === params.idClasse) {
        throw new ConflictException(
          `La classe a déjà un créneau de ${existing.heureDebut} à ${existing.heureFin} ce jour-là.`,
        );
      }
      if (params.idSalle && existing.idSalle === params.idSalle) {
        throw new ConflictException(
          `La salle est déjà occupée de ${existing.heureDebut} à ${existing.heureFin} ce jour-là.`,
        );
      }
    }
  }

  async create(dto: CreateEmploiDeTempsDto) {
    await this.assertValid(dto);
    await this.assertNoConflict(dto);

    return this.prisma.emploiDuTemps.create({
      data: dto,
      include: EMPLOI_INCLUDE,
    });
  }

  async findAll(params: FindAllEmploiParams = {}) {
    const where = {
      ...(params.idClasse ? { idClasse: params.idClasse } : {}),
      ...(params.idCours ? { idCours: params.idCours } : {}),
      ...(params.idSalle ? { idSalle: params.idSalle } : {}),
      ...(params.jour ? { jour: params.jour } : {}),
    };

    const shouldPaginate = params.page !== undefined || params.limit !== undefined;

    if (!shouldPaginate) {
      return this.prisma.emploiDuTemps.findMany({
        where,
        include: EMPLOI_INCLUDE,
        orderBy: [{ jour: 'asc' }, { heureDebut: 'asc' }],
      });
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
      data,
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
    return emploi;
  }

  async update(id: number, dto: UpdateEmploiDeTempsDto) {
    const existing = await this.findOne(id);

    const merged = {
      idClasse: dto.idClasse ?? existing.idClasse,
      idCours: dto.idCours ?? existing.idCours,
      idSalle: dto.idSalle !== undefined ? dto.idSalle : existing.idSalle ?? undefined,
      jour: dto.jour ?? existing.jour,
      heureDebut: dto.heureDebut ?? existing.heureDebut,
      heureFin: dto.heureFin ?? existing.heureFin,
    };

    await this.assertValid(merged);
    await this.assertNoConflict({ ...merged, excludeId: id });

    return this.prisma.emploiDuTemps.update({
      where: { id },
      data: dto,
      include: EMPLOI_INCLUDE,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.emploiDuTemps.delete({ where: { id } });
  }

  // Vue "emploi du temps classe" : tous les créneaux de la classe, triés jour/heure.
  async getGrilleClasse(idClasse: number) {
    const classe = await this.prisma.classe.findUnique({ where: { id: idClasse } });
    if (!classe) throw new NotFoundException(`Classe #${idClasse} introuvable`);

    return this.prisma.emploiDuTemps.findMany({
      where: { idClasse },
      include: EMPLOI_INCLUDE,
      orderBy: [{ jour: 'asc' }, { heureDebut: 'asc' }],
    });
  }

  // Vue "emploi du temps enseignant" : créneaux des cours que cet enseignant assure
  // (Enseignant.idPers -> idCours, relation déjà existante, pas de nouvelle relation).
  async getGrilleEnseignant(idPers: number) {
    const enseignant = await this.prisma.enseignant.findUnique({ where: { idPers } });
    if (!enseignant) throw new NotFoundException(`Aucun enseignant pour la personne #${idPers}`);

    return this.prisma.emploiDuTemps.findMany({
      where: { idCours: enseignant.idCours },
      include: EMPLOI_INCLUDE,
      orderBy: [{ jour: 'asc' }, { heureDebut: 'asc' }],
    });
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

    return this.prisma.emploiDuTemps.findMany({
      where: { idClasse: frequente.salle.idClasse },
      include: EMPLOI_INCLUDE,
      orderBy: [{ jour: 'asc' }, { heureDebut: 'asc' }],
    });
  }
}
