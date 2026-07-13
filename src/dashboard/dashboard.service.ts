import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdminStats() {
    const [
      totalEleves,
      totalEnseignants,
      totalClasses,
      totalCours,
      totalEvaluations,
      totalDisciplines,
      paiementsEffectues,
      anneeAcademiqueActive,
      scolarites,
    ] = await Promise.all([
      this.prisma.eleve.count(),
      this.prisma.enseignant.count(),
      this.prisma.classe.count(),
      this.prisma.cours.count(),
      this.prisma.evaluation.count(),
      this.prisma.discipline.count(),
      this.prisma.paiement.count(),
      this.prisma.anneeAcademique.findFirst({
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          libelle: true,
          periode: true,
          created_at: true,
        },
      }),
      this.prisma.scolarite.findMany({
        select: {
          fraisInscription: true,
          fraisScolarite: true,
          reduction: true,
          paiements: {
            select: {
              montant: true,
            },
          },
        },
      }),
    ]);

    const paiementsEnAttente = scolarites.reduce((count, scolarite) => {
      const montantAttendu =
        scolarite.fraisInscription + scolarite.fraisScolarite - scolarite.reduction;
      const montantPaye = scolarite.paiements.reduce(
        (sum, paiement) => sum + paiement.montant,
        0,
      );

      return montantPaye < montantAttendu ? count + 1 : count;
    }, 0);

    return {
      totalEleves,
      totalEnseignants,
      totalClasses,
      totalCours,
      totalEvaluations,
      totalDisciplines,
      anneeAcademiqueActive,
      paiements: {
        effectues: paiementsEffectues,
        enAttente: paiementsEnAttente,
      },
    };
  }
}
