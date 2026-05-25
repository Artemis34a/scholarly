import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnneeAcademiqueDto } from './dto/create-annee-academique.dto';
import { UpdateAnneeAcademiqueDto } from './dto/update-annee-academique.dto';

@Injectable()
export class AnneeAcademiqueService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateAnneeAcademiqueDto) { return this.prisma.anneeAcademique.create({ data: dto }); }
  findAll() { return this.prisma.anneeAcademique.findMany({ orderBy: { created_at: 'desc' } }); }

  async findOne(id: number) {
    const a = await this.prisma.anneeAcademique.findUnique({ where: { idAnnee: id } });
    if (!a) throw new NotFoundException(`AnneeAcademique #${id} introuvable`);
    return a;
  }

  async update(id: number, dto: UpdateAnneeAcademiqueDto) {
    await this.findOne(id);
    return this.prisma.anneeAcademique.update({ where: { idAnnee: id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.anneeAcademique.delete({ where: { idAnnee: id } });
  }
}
