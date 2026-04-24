import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async loginAdmin(username: string, password: string) {
    const admin = await this.prisma.admin.findUnique({ where: { username } });
    if (!admin) throw new UnauthorizedException('Identifiants incorrects');

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) throw new UnauthorizedException('Identifiants incorrects');

    const payload = { sub: admin.ID, username: admin.username, role: 'admin' };
    return {
      access_token: this.jwtService.sign(payload),
      admin: { id: admin.ID, username: admin.username, nom: admin.nom },
    };
  }

  async loginPersonne(username: string, password: string) {
    const personne = await this.prisma.personne.findUnique({ where: { username } });
    if (!personne) throw new UnauthorizedException('Identifiants incorrects');

    const valid = await bcrypt.compare(password, personne.password);
    if (!valid) throw new UnauthorizedException('Identifiants incorrects');

    const payload = { sub: personne.idPers, username: personne.username, role: 'personne' };
    return {
      access_token: this.jwtService.sign(payload),
      personne: { id: personne.idPers, username: personne.username, nom: personne.nom },
    };
  }
}
