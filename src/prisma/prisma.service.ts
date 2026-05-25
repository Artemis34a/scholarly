/**
 * prisma.service.ts
 *
 * Remplace le PrismaService original.
 * Construit dynamiquement l'URL de connexion selon DB_MODE
 * avant d'initialiser le client Prisma.
 */

import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { buildDatabaseUrl, isRemoteMode } from '../config/database.config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const url = buildDatabaseUrl();

    super({
      datasources: {
        db: { url },
      },
      // Log des queries en dev uniquement
      log: process.env.NODE_ENV === 'development'
        ? ['warn', 'error']
        : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log(
      isRemoteMode()
        ? '✅ Connecté à la BD distante du professeur (mode lecture conseillé)'
        : '✅ Connecté à la BD locale XAMPP'
    );
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
