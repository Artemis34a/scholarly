import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { buildDatabaseUrl } from '../config/database.config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    process.env.DATABASE_URL = buildDatabaseUrl();

    super();
  }

  async onModuleInit() {
    this.logger.log(
      `Connexion Prisma sur ${process.env.DB_HOST ?? 'localhost'}:${process.env.DB_PORT ?? '3306'}/${process.env.DB_NAME ?? ''}`,
    );
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
