import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNatureEpreuveDto } from './dto/create-nature-epreuve.dto';
import { CreateEpreuveDto } from './dto/create-epreuve.dto';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';

@Injectable()
export class EvaluationService {
  constructor(private prisma: PrismaService) {}

  // Nature Epreuve
  async createNatureEpreuve(dto: CreateNatureEpreuveDto, idAdmin?: number) {
    return this.prisma.natureEpreuve.create({
      data: { ...dto, idAdmin },
    });
  }

  async findAllNatureEpreuves() {
    return this.prisma.natureEpreuve.findMany();
  }

  async findOneNatureEpreuve(id: number) {
    const nature = await this.prisma.natureEpreuve.findUnique({
      where: { id },
    });
    if (!nature)
      throw new NotFoundException(`NatureEpreuve #${id} introuvable`);
    return nature;
  }

  async updateNatureEpreuve(id: number, dto: Partial<CreateNatureEpreuveDto>) {
    await this.findOneNatureEpreuve(id);
    return this.prisma.natureEpreuve.update({ where: { id }, data: dto });
  }

  async deleteNatureEpreuve(id: number) {
    await this.findOneNatureEpreuve(id);
    return this.prisma.natureEpreuve.delete({ where: { id } });
  }

  // Epreuve
  async createEpreuve(dto: CreateEpreuveDto, idAdmin?: number) {
    await this.prisma.natureEpreuve.findUniqueOrThrow({
      where: { id: dto.idNatureEpreuve },
    });
    if (dto.idCours) {
      await this.prisma.cours.findUniqueOrThrow({
        where: { id: dto.idCours },
      });
    }
    return this.prisma.epreuve.create({
      data: { ...dto, idAdmin },
    });
  }

  async findAllEpreuves() {
    return this.prisma.epreuve.findMany({
      include: { natureEpreuve: true, cours: true },
    });
  }

  async findOneEpreuve(id: number) {
    const epreuve = await this.prisma.epreuve.findUnique({
      where: { id },
      include: { natureEpreuve: true, cours: true, evaluations: true },
    });
    if (!epreuve) throw new NotFoundException(`Epreuve #${id} introuvable`);
    return epreuve;
  }

  async updateEpreuve(id: number, dto: Partial<CreateEpreuveDto>) {
    await this.findOneEpreuve(id);
    return this.prisma.epreuve.update({ where: { id }, data: dto });
  }

  async deleteEpreuve(id: number) {
    await this.findOneEpreuve(id);
    return this.prisma.epreuve.delete({ where: { id } });
  }

  // Evaluation
  async createEvaluation(dto: CreateEvaluationDto, idAdmin?: number) {
    await this.findOneEpreuve(dto.idEpreuve);

    // Verify student exists
    await this.prisma.eleve.findUniqueOrThrow({
      where: { id: dto.idEleve },
    });

    return this.prisma.evaluation.create({
      data: { ...dto, idAdmin },
    });
  }

  async findAllEvaluations() {
    return this.prisma.evaluation.findMany({
      include: { epreuve: true, eleve: true },
    });
  }

  async findOneEvaluation(id: number) {
    const evaluation = await this.prisma.evaluation.findUnique({
      where: { id },
      include: { epreuve: true, eleve: true },
    });
    if (!evaluation)
      throw new NotFoundException(`Evaluation #${id} introuvable`);
    return evaluation;
  }

  async updateEvaluation(id: number, dto: Partial<CreateEvaluationDto>) {
    await this.findOneEvaluation(id);
    return this.prisma.evaluation.update({ where: { id }, data: dto });
  }

  async deleteEvaluation(id: number) {
    await this.findOneEvaluation(id);
    return this.prisma.evaluation.delete({ where: { id } });
  }

  async findEvaluationsByEpreuve(idEpreuve: number) {
    return this.prisma.evaluation.findMany({
      where: { idEpreuve },
      include: { eleve: true },
    });
  }

  async findEvaluationsByEleve(idEleve: number) {
    return this.prisma.evaluation.findMany({
      where: { idEleve },
      include: { epreuve: true },
    });
  }
}
