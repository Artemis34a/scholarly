import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClasseDto } from './dto/create-classe.dto';
import { UpdateClasseDto } from './dto/update-classe.dto';

@Injectable()
export class ClasseService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateClasseDto) { return this.prisma.classe.create({ data: dto }); }
  findAll() { return this.prisma.classe.findMany({ orderBy: { libelle: 'asc' } }); }
  findByCycle(idCycle: number) { return this.prisma.classe.findMany({ where: { idCycle }, orderBy: { libelle: 'asc' } }); }

  async findOne(id: number) {
    const c = await this.prisma.classe.findUnique({ where: { idClasse: id } });
    if (!c) throw new NotFoundException(`Classe #${id} introuvable`);
    return c;
  }

  async update(id: number, dto: UpdateClasseDto) {
    await this.findOne(id);
    return this.prisma.classe.update({ where: { idClasse: id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.classe.delete({ where: { idClasse: id } });
  }
}
