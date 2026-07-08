import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClasseDto } from './dto/create-classe.dto';
import { UpdateClasseDto } from './dto/update-classe.dto';
import { AssignTitulaireDto } from './dto/assign-titulaire.dto';

export interface FindAllClassesParams {
  search?: string;
  idCycle?: number;
  page?: number;
  limit?: number;
}

// Le modèle Prisma actuel n'a pas de lien direct Classe -> Titulaire : les élèves
// (Frequente) et le titulaire (Titulaire) sont rattachés à une Salle, qui elle-même
// pointe vers une Classe. Dans ce projet une classe correspond en pratique à une
// seule salle (voir prisma/seed.ts). On gère donc ici une "salle principale" créée
// automatiquement avec la classe, sans modifier schema.prisma.
const CLASSE_INCLUDE = {
  cycle: true,
  salles: {
    orderBy: { id: 'asc' as const },
    include: {
      titulaire: { include: { personne: true } },
      _count: { select: { frequentes: true } },
    },
  },
  cours: {
    select: { id: true, libelle: true, coefficient: true, actif: true },
  },
};

@Injectable()
export class ClasseService {
  constructor(private prisma: PrismaService) {}

  private async getPrimarySalle(classeId: number) {
    const salle = await this.prisma.salle.findFirst({
      where: { idClasse: classeId },
      orderBy: { id: 'asc' },
    });
    return salle;
  }

  private async getOrCreatePrimarySalle(classeId: number, libelle: string, idAdmin?: number) {
    const existing = await this.getPrimarySalle(classeId);
    if (existing) return existing;

    return this.prisma.salle.create({
      data: {
        libelle: `Salle ${libelle}`,
        idClasse: classeId,
        actif: true,
        idAdmin,
      },
    });
  }

  async create(dto: CreateClasseDto) {
    const classe = await this.prisma.classe.create({
      data: {
        libelle: dto.libelle,
        idCycle: dto.idCycle,
        idAdmin: dto.idAdmin,
      },
    });

    await this.getOrCreatePrimarySalle(classe.id, classe.libelle, dto.idAdmin);

    return this.findOne(classe.id);
  }

  async findAll(params: FindAllClassesParams = {}) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 20;

    const where = {
      ...(params.search ? { libelle: { contains: params.search } } : {}),
      ...(params.idCycle ? { idCycle: params.idCycle } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.classe.findMany({
        where,
        include: CLASSE_INCLUDE,
        orderBy: { libelle: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.classe.count({ where }),
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
    const classe = await this.prisma.classe.findUnique({
      where: { id },
      include: CLASSE_INCLUDE,
    });
    if (!classe) throw new NotFoundException(`Classe #${id} introuvable`);
    return classe;
  }

  async update(id: number, dto: UpdateClasseDto) {
    await this.findOne(id);

    const classe = await this.prisma.classe.update({
      where: { id },
      data: {
        libelle: dto.libelle,
        idCycle: dto.idCycle,
        idAdmin: dto.idAdmin,
      },
    });

    // Garder le nom de la salle principale cohérent avec le libellé de la classe.
    if (dto.libelle) {
      const salle = await this.getPrimarySalle(id);
      if (salle) {
        await this.prisma.salle.update({
          where: { id: salle.id },
          data: { libelle: `Salle ${classe.libelle}` },
        });
      }
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.classe.delete({ where: { id } });
  }

  async findEleves(id: number) {
    await this.findOne(id);
    const salle = await this.getPrimarySalle(id);
    if (!salle) return [];

    return this.prisma.frequente.findMany({
      where: { idSalle: salle.id },
      include: { eleve: true },
      orderBy: { eleve: { nom: 'asc' } },
    });
  }

  async getTitulaire(id: number) {
    const salle = await this.getPrimarySalle(id);
    if (!salle) return null;

    return this.prisma.titulaire.findUnique({
      where: { idSalle: salle.id },
      include: { personne: true },
    });
  }

  async assignTitulaire(id: number, dto: AssignTitulaireDto) {
    const classe = await this.findOne(id);

    const personne = await this.prisma.personne.findUnique({ where: { id: dto.idPers } });
    if (!personne) throw new NotFoundException(`Personne #${dto.idPers} introuvable`);

    const salle = await this.getOrCreatePrimarySalle(id, classe.libelle, classe.idAdmin ?? undefined);

    // Titulaire.idPers est unique en base : une personne ne peut être titulaire
    // que d'une seule salle/classe à la fois.
    const existingAssignment = await this.prisma.titulaire.findUnique({
      where: { idPers: dto.idPers },
      include: { salle: { include: { classe: true } } },
    });
    if (existingAssignment && existingAssignment.idSalle !== salle.id) {
      throw new ConflictException(
        `${personne.nom} ${personne.prenom} est déjà titulaire de la classe "${existingAssignment.salle.classe?.libelle ?? existingAssignment.salle.libelle}". Retirez d'abord cette affectation.`,
      );
    }

    await this.prisma.titulaire.upsert({
      where: { idSalle: salle.id },
      update: { idPers: dto.idPers, actif: true },
      create: { idSalle: salle.id, idPers: dto.idPers, actif: true, idAdmin: classe.idAdmin },
    });

    return this.getTitulaire(id);
  }

  async removeTitulaire(id: number) {
    const salle = await this.getPrimarySalle(id);
    if (!salle) return { removed: false };

    const titulaire = await this.prisma.titulaire.findUnique({ where: { idSalle: salle.id } });
    if (!titulaire) return { removed: false };

    await this.prisma.titulaire.delete({ where: { idSalle: salle.id } });
    return { removed: true };
  }
}
