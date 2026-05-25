import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTitulaireDto } from './dto/create-titulaire.dto';
import { UpdateTitulaireDto } from './dto/update-titulaire.dto';

@Injectable()
export class TitulaireService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateTitulaireDto) { return this.prisma.titulaire.create({ data: dto }); }
  findAll() { return this.prisma.titulaire.findMany(); }
  findActifs() { return this.prisma.titulaire.findMany({ where: { actif: 1 } }); }

  async findOne(id: number) {
    const t = await this.prisma.titulaire.findUnique({ where: { idTitulaire: id } });
    if (!t) throw new NotFoundException(`Titulaire #${id} introuvable`);
    return t;
  }

  async update(id: number, dto: UpdateTitulaireDto) {
    await this.findOne(id);
    return this.prisma.titulaire.update({ where: { idTitulaire: id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.titulaire.delete({ where: { idTitulaire: id } });
  }
}
