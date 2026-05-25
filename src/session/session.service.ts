import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateSessionDto) { return this.prisma.session.create({ data: dto }); }
  findAll() { return this.prisma.session.findMany({ orderBy: { created_at: 'desc' } }); }
  findByTrimestre(idTrimestre: number) { return this.prisma.session.findMany({ where: { idTrimestre } }); }
  findByPersonne(idPers: number) { return this.prisma.session.findMany({ where: { idPers } }); }

  async findOne(id: number) {
    const s = await this.prisma.session.findUnique({ where: { idSession: id } });
    if (!s) throw new NotFoundException(`Session #${id} introuvable`);
    return s;
  }

  async update(id: number, dto: UpdateSessionDto) {
    await this.findOne(id);
    return this.prisma.session.update({ where: { idSession: id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.session.delete({ where: { idSession: id } });
  }
}
