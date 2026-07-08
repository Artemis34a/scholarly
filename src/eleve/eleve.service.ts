import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEleveDto } from './dto/create-eleve.dto';
import { UpdateEleveDto } from './dto/update-eleve.dto';

export interface FindAllElevesParams {
  search?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class EleveService {
  constructor(private prisma: PrismaService) {}

  private async assertUsernameAvailable(username: string) {
    const existing = await this.prisma.eleve.findUnique({ where: { username } });
    if (existing) throw new ConflictException('Ce nom d\'utilisateur est déjà utilisé');
  }

  async create(dto: CreateEleveDto) {
    await this.assertVilleNaissanceExiste(dto.idVilleNaissance);
    await this.assertAdminExiste(dto.idAdmin);
    await this.assertUsernameAvailable(dto.username);
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.eleve.create({
      data: {
        ...dto,
        dateNaissance: new Date(dto.dateNaissance),
        password: hashedPassword,
      },
    });
  }

  async findAll(params: FindAllElevesParams = {}) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 20;
    const where = params.search
      ? {
          OR: [
            { nom: { contains: params.search } },
            { prenom: { contains: params.search } },
          ],
        }
      : undefined;

    const [data, total] = await Promise.all([
      this.prisma.eleve.findMany({
        where,
        orderBy: [{ nom: 'asc' }, { prenom: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.eleve.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  findActifs() { return this.prisma.eleve.findMany({ where: { actif: true }, orderBy: [{ nom: 'asc' }] }); }

  async findOne(id: number) {
    const e = await this.prisma.eleve.findUnique({ where: { id } });
    if (!e) throw new NotFoundException(`Eleve #${id} introuvable`);
    return e;
  }

  async update(id: number, dto: UpdateEleveDto) {
    const eleve = await this.findOne(id);
    await this.assertVilleNaissanceExiste(dto.idVilleNaissance);
    await this.assertAdminExiste(dto.idAdmin);

    if (dto.username && dto.username !== eleve.username) {
      await this.assertUsernameAvailable(dto.username);
    }

    return this.prisma.eleve.update({
      where: { id },
      data: {
        ...dto,
        dateNaissance: dto.dateNaissance ? new Date(dto.dateNaissance) : undefined,
        password: dto.password ? await bcrypt.hash(dto.password, 10) : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.eleve.delete({ where: { id } });
  }

  private async assertVilleNaissanceExiste(idVilleNaissance?: number) {
    if (!idVilleNaissance) return;

    const ville = await this.prisma.villeNaissance.findUnique({
      where: { id: idVilleNaissance },
    });
    if (!ville) {
      throw new NotFoundException(
        `Ville de naissance #${idVilleNaissance} introuvable`,
      );
    }
  }

  // Le compte admin est transmis par le client (session courante). Si la base a
  // ete reinitialisee/reensemencee apres l'ouverture de la session (ex : reseed),
  // cet identifiant peut ne plus exister : sans cette verification, Prisma
  // rejette l'insertion avec une violation de cle etrangere non interceptee (500).
  private async assertAdminExiste(idAdmin?: number) {
    if (!idAdmin) return;

    const admin = await this.prisma.admin.findUnique({ where: { id: idAdmin } });
    if (!admin) {
      throw new UnauthorizedException(
        'Votre session administrateur est invalide ou perimee. Veuillez vous reconnecter.',
      );
    }
  }
}
