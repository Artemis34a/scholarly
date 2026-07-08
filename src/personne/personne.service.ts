import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePersonneDto } from './dto/create-personne.dto';
import { UpdatePersonneDto } from './dto/update-personne.dto';

@Injectable()
export class PersonneService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePersonneDto) {
    const exist = await this.prisma.personne.findUnique({
      where: { username: dto.username },
    });
    if (exist) throw new ConflictException('Username déjà utilisé');
    const hashed = await bcrypt.hash(dto.password, 10);
    return this.prisma.personne.create({
      data: {
        ...dto,
        password: hashed,
        typePersonne: dto.typePersonne as any,
      },
    });
  }

  async findAll() {
    return this.prisma.personne.findMany();
  }

  async findOne(id: number) {
    const p = await this.prisma.personne.findUnique({ where: { id: id } });
    if (!p) throw new NotFoundException(`Personne #${id} introuvable`);
    return p;
  }

  async findByType(typePersonne: number) {
    return this.prisma.personne.findMany({
      where: { typePersonne: typePersonne as any },
    });
  }

  async update(id: number, dto: UpdatePersonneDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.password) data.password = await bcrypt.hash(dto.password, 10);
    return this.prisma.personne.update({ where: { id: id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.personne.delete({ where: { id: id } });
  }
}
