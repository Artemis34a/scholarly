import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

function typePersonneToRole(typePersonne: string): string {
  switch (typePersonne) {
    case 'DIRECTEUR':
      return 'directeur';
    case 'ENSEIGNANT':
      return 'enseignant';
    case 'PARENT':
      return 'parent';
    default:
      return typePersonne.toLowerCase();
  }
}

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

    return this.issueSession(admin.id, admin.username, admin.nom, 'admin');
  }

  async loginEleve(username: string, password: string) {
    const eleve = await this.prisma.eleve.findUnique({ where: { username } });
    if (!eleve || !eleve.password) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    const valid = await bcrypt.compare(password, eleve.password);
    if (!valid) throw new UnauthorizedException('Identifiants incorrects');

    return this.issueSession(
      eleve.id,
      eleve.username as string,
      `${eleve.prenom} ${eleve.nom}`,
      'eleve',
    );
  }

  async loginPersonne(username: string, password: string) {
    const personne = await this.prisma.personne.findUnique({
      where: { username },
    });
    if (!personne) throw new UnauthorizedException('Identifiants incorrects');

    const valid = await bcrypt.compare(password, personne.password);
    if (!valid) throw new UnauthorizedException('Identifiants incorrects');

    const role = typePersonneToRole(personne.typePersonne);
    return this.issueSession(
      personne.id,
      personne.username,
      `${personne.prenom} ${personne.nom}`,
      role,
    );
  }

  private issueSession(
    id: number,
    username: string,
    nom: string,
    role: string,
  ) {
    const payload = { sub: id, username, role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id, username, nom, role },
    };
  }
}
