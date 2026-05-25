import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFrequenteDto } from './dto/create-frequente.dto';
import { UpdateFrequenteDto } from './dto/update-frequente.dto';

@Injectable()
export class FrequenteService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateFrequenteDto) { return this.prisma.frequente.create({ data: { ...dto, commentaire: dto.commentaire ?? '' } }); }
  findAll() { return this.prisma.frequente.findMany(); }
  findByClasse(idSalle: number) { return this.prisma.frequente.findMany({ where: { idSalle } }); }
  findByEleve(matricule: number) { return this.prisma.frequente.findMany({ where: { matricule } }); }
  findByAnnee(idAcademi: number) { return this.prisma.frequente.findMany({ where: { idAcademi } }); }

  async findOne(id: number) {
    const f = await this.prisma.frequente.findUnique({ where: { idFrequente: id } });
    if (!f) throw new NotFoundException(`Frequente #${id} introuvable`);
    return f;
  }

  async update(id: number, dto: UpdateFrequenteDto) {
    await this.findOne(id);
    return this.prisma.frequente.update({ where: { idFrequente: id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.frequente.delete({ where: { idFrequente: id } });
  }
}
