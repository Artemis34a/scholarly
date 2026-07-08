import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDisciplineDto } from './dto/create-discipline.dto';
import { UpdateDisciplineDto } from './dto/update-discipline.dto';
import { CreateRapportDto } from './dto/create-rapport.dto';
import { UpdateRapportDto } from './dto/update-rapport.dto';

export interface FindAllDisciplinesParams {
  search?: string;
  estFaute?: boolean;
  gravite?: number;
  page?: number;
  limit?: number;
}

export interface FindAllRapportsParams {
  search?: string;
  idEleve?: number;
  idDiscipline?: number;
  statut?: string;
  page?: number;
  limit?: number;
}

const RAPPORT_INCLUDE = {
  eleve: true,
  discipline: true,
  auteur: true,
};

@Injectable()
export class DisciplineService {
  constructor(private prisma: PrismaService) {}

  // ── Discipline (types de fautes / comportements) ─────────────────
  async createDiscipline(dto: CreateDisciplineDto, idAdmin?: number) {
    return this.prisma.discipline.create({
      data: { ...dto, idAdmin },
    });
  }

  // Pagination optionnelle : le formulaire de création de rapport a besoin de la
  // liste complète des disciplines pour son menu déroulant (même logique que pour
  // les modules Cours et Évaluations).
  async findAllDisciplines(params: FindAllDisciplinesParams = {}) {
    const where = {
      ...(params.search ? { libelle: { contains: params.search } } : {}),
      ...(params.estFaute !== undefined ? { estFaute: params.estFaute } : {}),
      ...(params.gravite !== undefined ? { gravite: params.gravite } : {}),
    };

    const shouldPaginate = params.page !== undefined || params.limit !== undefined;

    if (!shouldPaginate) {
      return this.prisma.discipline.findMany({
        where,
        include: { _count: { select: { rapports: true } } },
        orderBy: { libelle: 'asc' },
      });
    }

    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 20;

    const [data, total] = await Promise.all([
      this.prisma.discipline.findMany({
        where,
        include: { _count: { select: { rapports: true } } },
        orderBy: { libelle: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.discipline.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findOneDiscipline(id: number) {
    const discipline = await this.prisma.discipline.findUnique({
      where: { id },
      include: { rapports: { include: { eleve: true }, orderBy: { dateRapport: 'desc' } } },
    });
    if (!discipline)
      throw new NotFoundException(`Discipline #${id} introuvable`);
    return discipline;
  }

  async updateDiscipline(id: number, dto: UpdateDisciplineDto) {
    await this.findOneDiscipline(id);
    return this.prisma.discipline.update({ where: { id }, data: dto });
  }

  async deleteDiscipline(id: number) {
    await this.findOneDiscipline(id);
    return this.prisma.discipline.delete({ where: { id } });
  }

  // ── Rapport (incidents / historique disciplinaire) ────────────────
  async createRapport(dto: CreateRapportDto, idAdmin?: number) {
    const eleve = await this.prisma.eleve.findUnique({ where: { id: dto.idEleve } });
    if (!eleve) throw new NotFoundException(`Eleve #${dto.idEleve} introuvable`);

    const discipline = await this.prisma.discipline.findUnique({ where: { id: dto.idDiscipline } });
    if (!discipline) throw new NotFoundException(`Discipline #${dto.idDiscipline} introuvable`);

    const auteur = await this.prisma.personne.findUnique({ where: { id: dto.idAuteur } });
    if (!auteur) throw new NotFoundException(`Personne #${dto.idAuteur} introuvable`);

    return this.prisma.rapport.create({
      data: { ...dto, idAdmin },
      include: RAPPORT_INCLUDE,
    });
  }

  async findAllRapports(params: FindAllRapportsParams = {}) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 20;

    const where = {
      ...(params.idEleve ? { idEleve: params.idEleve } : {}),
      ...(params.idDiscipline ? { idDiscipline: params.idDiscipline } : {}),
      ...(params.statut ? { statut: params.statut } : {}),
      ...(params.search
        ? {
            OR: [
              { eleve: { nom: { contains: params.search } } },
              { eleve: { prenom: { contains: params.search } } },
              { description: { contains: params.search } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.rapport.findMany({
        where,
        include: RAPPORT_INCLUDE,
        orderBy: { dateRapport: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.rapport.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findOneRapport(id: number) {
    const rapport = await this.prisma.rapport.findUnique({
      where: { id },
      include: RAPPORT_INCLUDE,
    });
    if (!rapport) throw new NotFoundException(`Rapport #${id} introuvable`);
    return rapport;
  }

  async updateRapport(id: number, dto: UpdateRapportDto) {
    await this.findOneRapport(id);

    if (dto.idEleve) {
      const eleve = await this.prisma.eleve.findUnique({ where: { id: dto.idEleve } });
      if (!eleve) throw new NotFoundException(`Eleve #${dto.idEleve} introuvable`);
    }
    if (dto.idDiscipline) {
      const discipline = await this.prisma.discipline.findUnique({ where: { id: dto.idDiscipline } });
      if (!discipline) throw new NotFoundException(`Discipline #${dto.idDiscipline} introuvable`);
    }
    if (dto.idAuteur) {
      const auteur = await this.prisma.personne.findUnique({ where: { id: dto.idAuteur } });
      if (!auteur) throw new NotFoundException(`Personne #${dto.idAuteur} introuvable`);
    }

    return this.prisma.rapport.update({ where: { id }, data: dto, include: RAPPORT_INCLUDE });
  }

  async deleteRapport(id: number) {
    await this.findOneRapport(id);
    return this.prisma.rapport.delete({ where: { id } });
  }

  // Historique disciplinaire complet d'un élève, en ordre chronologique inverse :
  // vue dédiée pour le suivi individuel (profil élève), distincte de la liste
  // paginée générale des rapports.
  async getHistoriqueEleve(idEleve: number) {
    await this.prisma.eleve.findUniqueOrThrow({ where: { id: idEleve } });

    const rapports = await this.prisma.rapport.findMany({
      where: { idEleve },
      include: { discipline: true, auteur: true },
      orderBy: { dateRapport: 'desc' },
    });

    const fautes = rapports.filter((r) => r.discipline.estFaute).length;
    const comportementsPositifs = rapports.length - fautes;
    const ouverts = rapports.filter((r) => r.statut === 'OUVERT' || r.statut === 'EN_TRAITEMENT').length;

    return {
      idEleve,
      total: rapports.length,
      fautes,
      comportementsPositifs,
      dossiersOuverts: ouverts,
      rapports,
    };
  }
}
