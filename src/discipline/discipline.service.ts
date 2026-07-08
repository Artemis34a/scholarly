import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDisciplineDto } from './dto/create-discipline.dto';
import { CreateRapportDto } from './dto/create-rapport.dto';

@Injectable()
export class DisciplineService {
  constructor(private prisma: PrismaService) {}

  // Discipline
  async createDiscipline(dto: CreateDisciplineDto, idAdmin?: number) {
    return this.prisma.discipline.create({
      data: { ...dto, idAdmin },
    });
  }

  async findAllDisciplines() {
    return this.prisma.discipline.findMany();
  }

  async findOneDiscipline(id: number) {
    const discipline = await this.prisma.discipline.findUnique({
      where: { id },
      include: { rapports: true },
    });
    if (!discipline)
      throw new NotFoundException(`Discipline #${id} introuvable`);
    return discipline;
  }

  async updateDiscipline(id: number, dto: Partial<CreateDisciplineDto>) {
    await this.findOneDiscipline(id);
    return this.prisma.discipline.update({ where: { id }, data: dto });
  }

  async deleteDiscipline(id: number) {
    await this.findOneDiscipline(id);
    return this.prisma.discipline.delete({ where: { id } });
  }

  // Rapport
  async createRapport(dto: CreateRapportDto, idAdmin?: number) {
    // Verify related entities exist
    await this.prisma.eleve.findUniqueOrThrow({ where: { id: dto.idEleve } });
    await this.prisma.discipline.findUniqueOrThrow({
      where: { id: dto.idDiscipline },
    });
    await this.prisma.personne.findUniqueOrThrow({
      where: { id: dto.idAuteur },
    });

    return this.prisma.rapport.create({
      data: { ...dto, idAdmin },
    });
  }

  async findAllRapports() {
    return this.prisma.rapport.findMany({
      include: { eleve: true, discipline: true, auteur: true },
    });
  }

  async findOneRapport(id: number) {
    const rapport = await this.prisma.rapport.findUnique({
      where: { id },
      include: { eleve: true, discipline: true, auteur: true },
    });
    if (!rapport) throw new NotFoundException(`Rapport #${id} introuvable`);
    return rapport;
  }

  async updateRapport(id: number, dto: Partial<CreateRapportDto>) {
    await this.findOneRapport(id);
    return this.prisma.rapport.update({ where: { id }, data: dto });
  }

  async deleteRapport(id: number) {
    await this.findOneRapport(id);
    return this.prisma.rapport.delete({ where: { id } });
  }

  async findRapportsByEleve(idEleve: number) {
    return this.prisma.rapport.findMany({
      where: { idEleve },
      include: { discipline: true, auteur: true },
    });
  }

  async findRapportsByDiscipline(idDiscipline: number) {
    return this.prisma.rapport.findMany({
      where: { idDiscipline },
      include: { eleve: true, auteur: true },
    });
  }

  async findRapportsByStatut(statut: string) {
    return this.prisma.rapport.findMany({
      where: { statut },
      include: { eleve: true, discipline: true, auteur: true },
    });
  }
}
