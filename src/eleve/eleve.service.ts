import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEleveDto } from './dto/create-eleve.dto';
import { UpdateEleveDto } from './dto/update-eleve.dto';

@Injectable()
export class EleveService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateEleveDto) { return this.prisma.eleve.create({ data: dto }); }
  findAll() { return this.prisma.eleve.findMany({ orderBy: [{ nom: 'asc' }, { prenom: 'asc' }] }); }
  findActifs() { return this.prisma.eleve.findMany({ where: { actif: 1 }, orderBy: [{ nom: 'asc' }] }); }

  async findOne(matricule: number) {
    const e = await this.prisma.eleve.findUnique({ where: { matricule } });
    if (!e) throw new NotFoundException(`Eleve #${matricule} introuvable`);
    return e;
  }

  search(nom: string) {
    return this.prisma.eleve.findMany({
      where: { OR: [{ nom: { contains: nom } }, { prenom: { contains: nom } }] },
    });
  }

  async update(matricule: number, dto: UpdateEleveDto) {
    await this.findOne(matricule);
    return this.prisma.eleve.update({ where: { matricule }, data: dto });
  }

  async remove(matricule: number) {
    await this.findOne(matricule);
    return this.prisma.eleve.delete({ where: { matricule } });
  }
}
