import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCoursDto } from './dto/create-cours.dto';
import { UpdateCoursDto } from './dto/update-cours.dto';

export interface FindAllCoursParams {
  search?: string;
  idClasse?: number;
  page?: number;
  limit?: number;
}

// Les relations Cours -> Classe (idClasse) et Cours <- Enseignant (Enseignant.idCours)
// existent déjà dans schema.prisma (module Enseignant). On les expose ici via des
// includes, sans créer de nouvelle relation.
const COURS_INCLUDE = {
  classe: { include: { cycle: true } },
  enseignants: { include: { personne: true } },
};

@Injectable()
export class CoursService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateCoursDto) {
    return this.prisma.cours.create({ data: dto, include: COURS_INCLUDE });
  }

  // Pagination optionnelle : plusieurs pages du frontend (formulaires Enseignant/Classe)
  // consomment déjà `findAll()` en attendant un tableau complet pour peupler des menus
  // déroulants. On ne pagine que si `page`/`limit` sont explicitement fournis, pour ne
  // casser aucun appel existant.
  async findAll(params: FindAllCoursParams = {}) {
    const where = {
      ...(params.search ? { libelle: { contains: params.search } } : {}),
      ...(params.idClasse ? { idClasse: params.idClasse } : {}),
    };

    const shouldPaginate = params.page !== undefined || params.limit !== undefined;

    if (!shouldPaginate) {
      return this.prisma.cours.findMany({
        where,
        include: COURS_INCLUDE,
        orderBy: { libelle: 'asc' },
      });
    }

    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 20;

    const [data, total] = await Promise.all([
      this.prisma.cours.findMany({
        where,
        include: COURS_INCLUDE,
        orderBy: { libelle: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.cours.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  findActifs() {
    return this.prisma.cours.findMany({
      where: { actif: true },
      include: COURS_INCLUDE,
      orderBy: { libelle: 'asc' },
    });
  }

  async findOne(id: number) {
    const c = await this.prisma.cours.findUnique({ where: { id }, include: COURS_INCLUDE });
    if (!c) throw new NotFoundException(`Cours #${id} introuvable`);
    return c;
  }

  async update(id: number, dto: UpdateCoursDto) {
    await this.findOne(id);
    return this.prisma.cours.update({ where: { id }, data: dto, include: COURS_INCLUDE });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.cours.delete({ where: { id } });
  }
}
