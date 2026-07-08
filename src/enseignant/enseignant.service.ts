import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TypePersonne } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnseignantDto } from './dto/create-enseignant.dto';
import { UpdateEnseignantDto } from './dto/update-enseignant.dto';

export interface FindAllEnseignantsParams {
  search?: string;
  page?: number;
  limit?: number;
}

const ENSEIGNANT_INCLUDE = {
  personne: true,
  cours: { include: { classe: true } },
} as const;

@Injectable()
export class EnseignantService {
  constructor(private prisma: PrismaService) {}

  private async assertUsernameAvailable(username: string) {
    const existing = await this.prisma.personne.findUnique({
      where: { username },
    });
    if (existing) throw new ConflictException('Ce nom d\'utilisateur est déjà utilisé');
  }

  private async assertCoursExists(idCours: number) {
    const cours = await this.prisma.cours.findUnique({ where: { id: idCours } });
    if (!cours) throw new NotFoundException(`Cours #${idCours} introuvable`);
  }

  async create(dto: CreateEnseignantDto) {
    await this.assertUsernameAvailable(dto.username);
    await this.assertCoursExists(dto.idCours);

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const personne = await this.prisma.personne.create({
      data: {
        nom: dto.nom,
        prenom: dto.prenom,
        username: dto.username,
        password: hashedPassword,
        mobile: dto.mobile,
        phone: dto.phone,
        dateNaissance: dto.dateNaissance ? new Date(dto.dateNaissance) : undefined,
        lieuNaissance: dto.lieuNaissance,
        typePersonne: TypePersonne.ENSEIGNANT,
        idAdmin: dto.idAdmin,
      },
    });

    return this.prisma.enseignant.create({
      data: {
        idPers: personne.id,
        idCours: dto.idCours,
        actif: dto.actif ?? true,
        idAdmin: dto.idAdmin,
      },
      include: ENSEIGNANT_INCLUDE,
    });
  }

  async findAll(params: FindAllEnseignantsParams = {}) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 20;
    const where = params.search
      ? {
          personne: {
            OR: [
              { nom: { contains: params.search } },
              { prenom: { contains: params.search } },
            ],
          },
        }
      : undefined;

    const [data, total] = await Promise.all([
      this.prisma.enseignant.findMany({
        where,
        include: ENSEIGNANT_INCLUDE,
        orderBy: { personne: { nom: 'asc' } },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.enseignant.count({ where }),
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
    return this.prisma.enseignant.findMany({
      where: { actif: true },
      include: ENSEIGNANT_INCLUDE,
      orderBy: { personne: { nom: 'asc' } },
    });
  }

  async findOne(id: number) {
    const enseignant = await this.prisma.enseignant.findUnique({
      where: { id },
      include: ENSEIGNANT_INCLUDE,
    });
    if (!enseignant) throw new NotFoundException(`Enseignant #${id} introuvable`);
    return enseignant;
  }

  async update(id: number, dto: UpdateEnseignantDto) {
    const enseignant = await this.findOne(id);

    if (dto.username && dto.username !== enseignant.personne.username) {
      await this.assertUsernameAvailable(dto.username);
    }
    if (dto.idCours !== undefined) {
      await this.assertCoursExists(dto.idCours);
    }

    const personneData: Record<string, unknown> = {};
    if (dto.nom !== undefined) personneData.nom = dto.nom;
    if (dto.prenom !== undefined) personneData.prenom = dto.prenom;
    if (dto.username !== undefined) personneData.username = dto.username;
    if (dto.mobile !== undefined) personneData.mobile = dto.mobile;
    if (dto.phone !== undefined) personneData.phone = dto.phone;
    if (dto.lieuNaissance !== undefined) personneData.lieuNaissance = dto.lieuNaissance;
    if (dto.dateNaissance !== undefined) personneData.dateNaissance = new Date(dto.dateNaissance);
    if (dto.password) personneData.password = await bcrypt.hash(dto.password, 10);

    if (Object.keys(personneData).length > 0) {
      await this.prisma.personne.update({
        where: { id: enseignant.idPers },
        data: personneData,
      });
    }

    const enseignantData: Record<string, unknown> = {};
    if (dto.idCours !== undefined) enseignantData.idCours = dto.idCours;
    if (dto.actif !== undefined) enseignantData.actif = dto.actif;

    if (Object.keys(enseignantData).length > 0) {
      await this.prisma.enseignant.update({ where: { id }, data: enseignantData });
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.enseignant.delete({ where: { id } });
  }
}
