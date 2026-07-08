import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrimestreDto } from './dto/create-trimestre.dto';
import { UpdateTrimestreDto } from './dto/update-trimestre.dto';

@Injectable()
export class TrimestreService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateTrimestreDto) { return this.prisma.trimestre.create({ data: dto }); }
  findAll() { return this.prisma.trimestre.findMany(); }
  findByAnnee(idAca: number) { return this.prisma.trimestre.findMany({ where: { idAca } }); }

  async findOne(id: number) {
    const t = await this.prisma.trimestre.findUnique({ where: { id } });
    if (!t) throw new NotFoundException(`Trimestre #${id} introuvable`);
    return t;
  }

  async update(id: number, dto: UpdateTrimestreDto) {
    await this.findOne(id);
    return this.prisma.trimestre.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.trimestre.delete({ where: { id } });
  }
}
