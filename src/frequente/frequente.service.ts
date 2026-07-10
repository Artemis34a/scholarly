import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFrequenteDto } from './dto/create-frequente.dto';
import { UpdateFrequenteDto } from './dto/update-frequente.dto';

@Injectable()
export class FrequenteService {
  constructor(private prisma: PrismaService) {}

  private async assertEleveExiste(idEleve: number) {
    const eleve = await this.prisma.eleve.findUnique({ where: { id: idEleve } });
    if (!eleve) throw new NotFoundException(`Eleve #${idEleve} introuvable`);
  }

  private async assertSalleExiste(idSalle: number) {
    const salle = await this.prisma.salle.findUnique({ where: { id: idSalle } });
    if (!salle) throw new NotFoundException(`Salle #${idSalle} introuvable`);
  }

  // Inscrire un élève dans une salle constitue aussi l'opération "changer de
  // classe" : un élève ne doit jamais appartenir à deux classes en même temps
  // (voir audit QA). Toute inscription précédente de cet élève est donc retirée
  // avant de créer la nouvelle, dans une seule transaction — inscrire un élève
  // déjà inscrit ailleurs le déplace proprement au lieu de le dupliquer.
  async create(dto: CreateFrequenteDto) {
    await this.assertEleveExiste(dto.idEleve);
    await this.assertSalleExiste(dto.idSalle);

    return this.prisma.$transaction(async (tx) => {
      await tx.frequente.deleteMany({ where: { idEleve: dto.idEleve } });
      return tx.frequente.create({
        data: { ...dto, commentaire: dto.commentaire ?? '' },
      });
    });
  }

  findAll() { return this.prisma.frequente.findMany(); }
  findByClasse(idSalle: number) { return this.prisma.frequente.findMany({ where: { idSalle } }); }
  findByEleve(idEleve: number) { return this.prisma.frequente.findMany({ where: { idEleve } }); }
  findByAnnee(idAnneeAcademique: number) {
    return this.prisma.frequente.findMany({
      where: { eleve: { scolarites: { some: { idAnneeAcademique } } } },
    });
  }

  async findOne(id: number) {
    const f = await this.prisma.frequente.findUnique({ where: { id } });
    if (!f) throw new NotFoundException(`Frequente #${id} introuvable`);
    return f;
  }

  async update(id: number, dto: UpdateFrequenteDto) {
    await this.findOne(id);
    if (dto.idSalle !== undefined) await this.assertSalleExiste(dto.idSalle);
    return this.prisma.frequente.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.frequente.delete({ where: { id } });
  }
}
