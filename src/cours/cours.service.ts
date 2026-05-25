import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCoursDto } from './dto/create-cours.dto';
import { UpdateCoursDto } from './dto/update-cours.dto';

@Injectable()
export class CoursService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateCoursDto) { return this.prisma.cours.create({ data: dto }); }
  findAll() { return this.prisma.cours.findMany({ orderBy: { libelle: 'asc' } }); }
  findActifs() { return this.prisma.cours.findMany({ where: { actif: 1 }, orderBy: { libelle: 'asc' } }); }

  async findOne(id: number) {
    const c = await this.prisma.cours.findUnique({ where: { idCours: id } });
    if (!c) throw new NotFoundException(`Cours #${id} introuvable`);
    return c;
  }

  async update(id: number, dto: UpdateCoursDto) {
    await this.findOne(id);
    return this.prisma.cours.update({ where: { idCours: id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.cours.delete({ where: { idCours: id } });
  }
}
