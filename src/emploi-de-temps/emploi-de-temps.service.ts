import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmploiDeTempsDto } from './dto/create-emploi-de-temps.dto';
import { UpdateEmploiDeTempsDto } from './dto/update-emploi-de-temps.dto';

@Injectable()
export class EmploiDeTempsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateEmploiDeTempsDto) { return this.prisma.emploiDuTemps.create({ data: dto }); }
  findAll() { return this.prisma.emploiDuTemps.findMany(); }
  findByClasse(idClasse: number) { return this.prisma.emploiDuTemps.findMany({ where: { idClasse }, orderBy: [{ jour: 'asc' }, { heure: 'asc' }] }); }

  async findOne(id: number) {
    const e = await this.prisma.emploiDuTemps.findUnique({ where: { idTemps: id } });
    if (!e) throw new NotFoundException(`EmploiDeTemps #${id} introuvable`);
    return e;
  }

  async update(id: number, dto: UpdateEmploiDeTempsDto) {
    await this.findOne(id);
    return this.prisma.emploiDuTemps.update({ where: { idTemps: id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.emploiDuTemps.delete({ where: { idTemps: id } });
  }
}
