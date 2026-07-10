import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TypePersonne } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { assertDateNaissanceValide } from '../shared/validators';
import { CreateEnseignantDto } from './dto/create-enseignant.dto';
import { UpdateEnseignantDto } from './dto/update-enseignant.dto';

export interface FindAllEnseignantsParams {
  search?: string;
  page?: number;
  limit?: number;
}

// Un enseignant n'a plus de lien direct vers un unique cours : ce qu'il enseigne
// (et dans quelle classe) est porté par ses Affectation(s), chacune rattachée à
// une combinaison cours/classe (ClasseCours) précise. Le titulariat (Titulaire)
// reste un modèle totalement séparé, non touché ici.
const ENSEIGNANT_INCLUDE = {
  personne: true,
  affectations: {
    include: {
      classeCours: { include: { cours: true, classe: true } },
    },
  },
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

  private async assertClasseCoursExists(idClasseCours: number) {
    const classeCours = await this.prisma.classeCours.findUnique({ where: { id: idClasseCours } });
    if (!classeCours) throw new NotFoundException(`Affectation cours/classe #${idClasseCours} introuvable`);
    return classeCours;
  }

  async create(dto: CreateEnseignantDto) {
    await this.assertUsernameAvailable(dto.username);
    await this.assertClasseCoursExists(dto.idClasseCours);
    if (dto.dateNaissance) assertDateNaissanceValide(dto.dateNaissance);

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

    const enseignant = await this.prisma.enseignant.create({
      data: {
        idPers: personne.id,
        actif: dto.actif ?? true,
        idAdmin: dto.idAdmin,
        affectations: {
          create: { idClasseCours: dto.idClasseCours, idAdmin: dto.idAdmin },
        },
      },
      include: ENSEIGNANT_INCLUDE,
    });

    return enseignant;
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
    if (dto.dateNaissance !== undefined) assertDateNaissanceValide(dto.dateNaissance);

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

    // Les affectations (quels cours, dans quelles classes) se gèrent exclusivement
    // via addAffectation/removeAffectation ci-dessous, jamais depuis update() : on
    // évite ainsi deux chemins différents pour la même opération.
    const enseignantData: Record<string, unknown> = {};
    if (dto.actif !== undefined) enseignantData.actif = dto.actif;

    if (Object.keys(enseignantData).length > 0) {
      await this.prisma.enseignant.update({ where: { id }, data: enseignantData });
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    const enseignant = await this.findOne(id);
    // On supprime la Personne plutôt que la seule ligne Enseignant : la personne
    // a été créée spécifiquement pour ce rôle (voir create() ci-dessus), donc la
    // "suppression d'un enseignant" doit aussi révoquer son compte de connexion,
    // pas seulement son affectation à un cours. Les enregistrements liés (Titulaire,
    // Affectation) sont déjà en CASCADE sur Personne/Enseignant dans le schéma :
    // ils disparaissent automatiquement, sans laisser de titulariat ou de compte
    // incohérent derrière soi.
    await this.prisma.personne.delete({ where: { id: enseignant.idPers } });
    return enseignant;
  }

  // ── Affectations d'enseignement ──────────────────────────────────────
  async addAffectation(idEnseignant: number, idClasseCours: number, idAdmin?: number) {
    await this.findOne(idEnseignant);
    await this.assertClasseCoursExists(idClasseCours);

    const existing = await this.prisma.affectation.findUnique({
      where: { idEnseignant_idClasseCours: { idEnseignant, idClasseCours } },
    });
    if (existing) {
      throw new ConflictException('Cet enseignant est déjà affecté à ce cours dans cette classe.');
    }

    await this.prisma.affectation.create({ data: { idEnseignant, idClasseCours, idAdmin } });
    return this.findOne(idEnseignant);
  }

  async removeAffectation(idEnseignant: number, idAffectation: number) {
    await this.findOne(idEnseignant);

    const affectation = await this.prisma.affectation.findUnique({ where: { id: idAffectation } });
    if (!affectation || affectation.idEnseignant !== idEnseignant) {
      throw new NotFoundException(`Affectation #${idAffectation} introuvable pour cet enseignant`);
    }

    await this.prisma.affectation.delete({ where: { id: idAffectation } });
    return this.findOne(idEnseignant);
  }
}
