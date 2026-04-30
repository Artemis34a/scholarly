import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAdminDto) {
    const exist = await this.prisma.admin.findUnique({
      where: { username: dto.username },
    });
    if (exist) throw new ConflictException('Username déjà utilisé');
    const hashed = await bcrypt.hash(dto.password, 10);
    return this.prisma.admin.create({ data: { ...dto, password: hashed } });
  }

  async findAll() {
    return this.prisma.admin.findMany();
  }

  async findOne(id: number) {
    const a = await this.prisma.admin.findUnique({ where: { id: id } });
    if (!a) throw new NotFoundException(`Admin #${id} introuvable`);
    return a;
  }

  async findByUsername(username: string) {
    return this.prisma.admin.findUnique({ where: { username } });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.admin.delete({ where: { id: id } });
  }
}
