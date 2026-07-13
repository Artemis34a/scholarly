import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

export interface FindAllAdminsParams {
  search?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  private async assertUsernameAvailable(username: string) {
    const existing = await this.prisma.admin.findUnique({ where: { username } });
    if (existing) throw new ConflictException('Ce nom d\'utilisateur est déjà utilisé');
  }

  async create(dto: CreateAdminDto) {
    await this.assertUsernameAvailable(dto.username);
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.prisma.admin.create({
      data: { ...dto, password: hashedPassword },
    });
  }

  async findAll(params: FindAllAdminsParams = {}) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 20;
    const where = params.search
      ? {
          OR: [
            { nom: { contains: params.search } },
            { username: { contains: params.search } },
          ],
        }
      : undefined;

    const [data, total] = await Promise.all([
      this.prisma.admin.findMany({
        where,
        orderBy: { nom: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.admin.count({ where }),
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
    const admin = await this.prisma.admin.findUnique({ where: { id } });
    if (!admin) throw new NotFoundException(`Admin #${id} introuvable`);
    return admin;
  }

  async update(id: number, dto: UpdateAdminDto) {
    const admin = await this.findOne(id);

    if (dto.username && dto.username !== admin.username) {
      await this.assertUsernameAvailable(dto.username);
    }

    return this.prisma.admin.update({
      where: { id },
      data: {
        ...dto,
        password: dto.password ? await bcrypt.hash(dto.password, 10) : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const total = await this.prisma.admin.count();
    if (total <= 1) {
      throw new BadRequestException(
        'Impossible de supprimer le dernier compte administrateur.',
      );
    }

    return this.prisma.admin.delete({ where: { id } });
  }
}
