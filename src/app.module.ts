import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PersonneModule } from './personne/personne.module';
import { AdminModule } from './admin/admin.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { DisciplineModule } from './discipline/discipline.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EleveModule } from './eleve/eleve.module';
import { VilleNaissanceModule } from './ville-naissance/ville-naissance.module';
import { AnneeAcademiqueModule } from './annee-academique/annee-academique.module';
import { ClasseModule } from './classe/classe.module';
import { CoursModule } from './cours/cours.module';
import { CycleModule } from './cycle/cycle.module';
import { EmploiDeTempsModule } from './emploi-de-temps/emploi-de-temps.module';
import { FrequenteModule } from './frequente/frequente.module';
import { SessionModule } from './session/session.module';
import { TitulaireModule } from './titulaire/titulaire.module';
import { TrimestreModule } from './trimestre/trimestre.module';
import { EnseignantModule } from './enseignant/enseignant.module';
import { PaiementModule } from './paiement/paiement.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    PersonneModule,
    AdminModule,
    EvaluationModule,
    DisciplineModule,
    DashboardModule,
    EleveModule,
    VilleNaissanceModule,
    AnneeAcademiqueModule,
    ClasseModule,
    CoursModule,
    CycleModule,
    EmploiDeTempsModule,
    FrequenteModule,
    SessionModule,
    TitulaireModule,
    TrimestreModule,
    EnseignantModule,
    PaiementModule,
  ],
})
export class AppModule {}
