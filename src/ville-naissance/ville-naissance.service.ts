import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVilleNaissanceDto } from './dto/create-ville-naissance.dto';
import { UpdateVilleNaissanceDto } from './dto/update-ville-naissance.dto';

@Injectable()
export class VilleNaissanceService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateVilleNaissanceDto) {
    return this.prisma.villeNaissance.create({ data: dto });
  }
  findAll() {
    return this.prisma.villeNaissance.findMany({ orderBy: { libelle: 'asc' } });
  }
  findActives() {
    return this.prisma.villeNaissance.findMany({ where: { actif: 1 }, orderBy: { libelle: 'asc' } });
  }
  async findOne(id: number) {
    const v = await this.prisma.villeNaissance.findUnique({ where: { idVille: id } });
    if (!v) throw new NotFoundException(`VilleNaissance #${id} introuvable`);
    return v;
  }
  async update(id: number, dto: UpdateVilleNaissanceDto) {
    await this.findOne(id);
    return this.prisma.villeNaissance.update({ where: { idVille: id }, data: dto });
  }
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.villeNaissance.delete({ where: { idVille: id } });
  }
}
