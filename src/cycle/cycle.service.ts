import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCycleDto } from './dto/create-cycle.dto';
import { UpdateCycleDto } from './dto/update-cycle.dto';

@Injectable()
export class CycleService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateCycleDto) { return this.prisma.cycle.create({ data: dto }); }
  findAll() { return this.prisma.cycle.findMany({ orderBy: { libelle: 'asc' } }); }

  async findOne(id: number) {
    const c = await this.prisma.cycle.findUnique({ where: { id } });
    if (!c) throw new NotFoundException(`Cycle #${id} introuvable`);
    return c;
  }

  async update(id: number, dto: UpdateCycleDto) {
    await this.findOne(id);
    return this.prisma.cycle.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.cycle.delete({ where: { id } });
  }
}
