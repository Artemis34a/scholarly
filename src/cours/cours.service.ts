import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCoursDto } from './dto/create-cours.dto';
import { UpdateCoursDto } from './dto/update-cours.dto';

export interface FindAllCoursParams {
  search?: string;
  idClasse?: number;
  page?: number;
  limit?: number;
}

// Un cours peut désormais être enseigné dans plusieurs classes (table de jonction
// ClasseCours) ; les enseignants qui l'assurent transitent par Affectation, elle-même
// rattachée à une ligne ClasseCours précise (un enseignant est affecté à "ce cours
// dans cette classe", jamais au cours seul).
const COURS_INCLUDE = {
  classesCours: {
    include: {
      classe: { include: { cycle: true } },
      affectations: { include: { enseignant: { include: { personne: true } } } },
    },
  },
};

@Injectable()
export class CoursService {
  constructor(private prisma: PrismaService) {}

  private async assertClasseExiste(idClasse: number) {
    const classe = await this.prisma.classe.findUnique({ where: { id: idClasse } });
    if (!classe) throw new NotFoundException(`Classe #${idClasse} introuvable`);
  }

  async create(dto: CreateCoursDto) {
    const { idClasses, ...coursData } = dto;

    if (idClasses) {
      for (const idClasse of idClasses) {
        await this.assertClasseExiste(idClasse);
      }
    }

    const cours = await this.prisma.cours.create({
      data: {
        ...coursData,
        classesCours: idClasses
          ? { create: idClasses.map((idClasse) => ({ idClasse, idAdmin: dto.idAdmin })) }
          : undefined,
      },
      include: COURS_INCLUDE,
    });

    return cours;
  }

  // Pagination optionnelle : plusieurs pages du frontend (formulaires Enseignant/Classe)
  // consomment déjà `findAll()` en attendant un tableau complet pour peupler des menus
  // déroulants. On ne pagine que si `page`/`limit` sont explicitement fournis, pour ne
  // casser aucun appel existant.
  async findAll(params: FindAllCoursParams = {}) {
    const where = {
      ...(params.search ? { libelle: { contains: params.search } } : {}),
      ...(params.idClasse ? { classesCours: { some: { idClasse: params.idClasse } } } : {}),
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
    // L'association aux classes se gère exclusivement via addClasse/removeClasse,
    // pour ne jamais dupliquer cette logique (ex : quelles Affectation supprimer
    // si une classe est retirée de la liste) dans deux endroits différents.
    const { idClasses, ...coursData } = dto;
    return this.prisma.cours.update({ where: { id }, data: coursData, include: COURS_INCLUDE });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.cours.delete({ where: { id } });
  }

  // ── Association aux classes ──────────────────────────────────────────
  async addClasse(idCours: number, idClasse: number, idAdmin?: number) {
    await this.findOne(idCours);
    await this.assertClasseExiste(idClasse);

    const existing = await this.prisma.classeCours.findUnique({
      where: { idClasse_idCours: { idClasse, idCours } },
    });
    if (existing) {
      throw new ConflictException('Ce cours est déjà enseigné dans cette classe.');
    }

    await this.prisma.classeCours.create({ data: { idClasse, idCours, idAdmin } });
    return this.findOne(idCours);
  }

  async removeClasse(idCours: number, idClasse: number) {
    await this.findOne(idCours);

    const classeCours = await this.prisma.classeCours.findUnique({
      where: { idClasse_idCours: { idClasse, idCours } },
    });
    if (!classeCours) {
      throw new NotFoundException("Ce cours n'est pas enseigné dans cette classe.");
    }

    // Supprime aussi, en cascade (contrainte FK), les affectations d'enseignants
    // rattachées à cette combinaison cours/classe : elles n'auraient plus de sens
    // une fois le cours retiré de cette classe.
    await this.prisma.classeCours.delete({ where: { id: classeCours.id } });
    return this.findOne(idCours);
  }
}
