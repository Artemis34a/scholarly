import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { resolve } from 'node:path';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    if (!process.env.DATABASE_URL) {
      process.env.DATABASE_URL = `file:${resolve(process.cwd(), 'prisma', 'dev.db')}`;
    }

    super();
  }

  async onModuleInit() {
    this.logger.log(`Connexion Prisma sur ${process.env.DATABASE_URL}`);
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
