import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PersonneModule } from './personne/personne.module';
import { AdminModule } from './admin/admin.module';
import { ClasseModule } from './classe/classe.module';
import { AnneeAcademiqueModule } from './annee-academique/annee-academique.module';
import { FrequenteModule } from './frequente/frequente.module';
import { TitulaireModule } from './titulaire/titulaire.module';
import { VilleNaissanceModule } from './ville-naissance/ville-naissance.module';
import { EleveModule } from './eleve/eleve.module';
import { EmploiDeTempsModule } from './emploi-de-temps/emploi-de-temps.module';
import { CoursModule } from './cours/cours.module';
import { CycleModule } from './cycle/cycle.module';
import { SessionModule } from './session/session.module';
import { TrimestreModule } from './trimestre/trimestre.module';
import { AnneeAcademiqueModule } from './annee-academique/annee-academique.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    PersonneModule,
    AdminModule,
    ClasseModule,
    AnneeAcademiqueModule,
    TrimestreModule,
    SessionModule,
    CycleModule,
    CoursModule,
    EmploiDeTempsModule,
    EleveModule,
    VilleNaissanceModule,
    TitulaireModule,
    FrequenteModule,
  ],
})
export class AppModule {}
