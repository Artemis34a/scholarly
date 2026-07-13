import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCycleDto } from './dto/create-cycle.dto';
import { UpdateCycleDto } from './dto/update-cycle.dto';

@Injectable()
export class CycleService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCycleDto) {
    const existing = await this.prisma.cycle.findFirst({ where: { libelle: dto.libelle } });
    if (existing) {
      throw new ConflictException(`Le "${dto.libelle}" existe déjà.`);
    }
    return this.prisma.cycle.create({ data: dto });
  }

  findAll() { return this.prisma.cycle.findMany({ orderBy: { libelle: 'asc' } }); }

  async findOne(id: number) {
    const c = await this.prisma.cycle.findUnique({ where: { id } });
    if (!c) throw new NotFoundException(`Cycle #${id} introuvable`);
    return c;
  }

  async update(id: number, dto: UpdateCycleDto) {
    await this.findOne(id);
    // Le libellé identifie l'un des deux cycles fixes de l'établissement : seule
    // la description peut être ajustée.
    const { libelle, ...rest } = dto;
    return this.prisma.cycle.update({ where: { id }, data: rest });
  }

  async remove(id: number) {
    await this.findOne(id);
    // Supprimer un cycle supprimerait en cascade toutes les classes qui en
    // dépendent (Classe.idCycle -> onDelete: Cascade). L'établissement ne
    // comportant que deux cycles fixes, la suppression est interdite.
    throw new ForbiddenException(
      'Les cycles de l\'établissement sont fixes (Cycle maternel, Cycle primaire) et ne peuvent pas être supprimés.',
    );
  }
}
