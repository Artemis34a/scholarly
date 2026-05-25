import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  // ── Génère access (15min) + refresh (7j) ──────────────────
  private generateTokens(payload: { sub: number; email: string; role: string }) {
    const access = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: '15m',
    });

    const refresh = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return { access, refresh };
  }

  // ── Login admin (cherche par email) ───────────────────────
  async loginAdmin(email: string, password: string) {
    // NOTE : Admin n'a pas de champ email dans le schéma actuel.
    // On cherche par username = email pour la compatibilité.
    // Si tu ajoutes un champ email à la table Admin, remplace
    // "username: email" par "email: email" ici.
    const admin = await this.prisma.admin.findUnique({ where: { username: email } });
    if (!admin) throw new UnauthorizedException('Identifiants incorrects');

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) throw new UnauthorizedException('Identifiants incorrects');

    const payload = { sub: admin.ID, email: admin.username, role: 'admin' };
    const { access, refresh } = this.generateTokens(payload);

    return {
      access,
      refresh,
      user: {
        id:    admin.ID,
        email: admin.username,
        nom:   admin.nom,
        role:  'admin',
      },
    };
  }

  // ── Login personne (cherche par username = email) ─────────
  async loginPersonne(email: string, password: string) {
    const personne = await this.prisma.personne.findUnique({ where: { username: email } });
    if (!personne) throw new UnauthorizedException('Identifiants incorrects');

    const valid = await bcrypt.compare(password, personne.password);
    if (!valid) throw new UnauthorizedException('Identifiants incorrects');

    const payload = { sub: personne.idPers, email: personne.username, role: 'personne' };
    const { access, refresh } = this.generateTokens(payload);

    return {
      access,
      refresh,
      user: {
        id:    personne.idPers,
        email: personne.username,
        nom:   personne.nom,
        role:  'personne',
      },
    };
  }

  // ── Rafraîchir le token ────────────────────────────────────
  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });

      // Reconstruire le payload proprement (sans iat/exp)
      const newPayload = { sub: payload.sub, email: payload.email, role: payload.role };
      const { access, refresh } = this.generateTokens(newPayload);

      return { access, refresh };

    } catch {
      throw new UnauthorizedException('Refresh token invalide ou expiré');
    }
  }
}
