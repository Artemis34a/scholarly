import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PersonneModule } from './personne/personne.module';
import { AdminModule } from './admin/admin.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { DisciplineModule } from './discipline/discipline.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    PersonneModule,
    AdminModule,
    EvaluationModule,
    DisciplineModule,
  ],
})
export class AppModule {}
