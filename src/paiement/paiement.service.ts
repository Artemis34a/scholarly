import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModePaiementDto } from './dto/create-mode-paiement.dto';
import { UpdateModePaiementDto } from './dto/update-mode-paiement.dto';
import { CreateTrancheDto } from './dto/create-tranche.dto';
import { UpdateTrancheDto } from './dto/update-tranche.dto';
import { CreateScolariteDto } from './dto/create-scolarite.dto';
import { UpdateScolariteDto } from './dto/update-scolarite.dto';
import { CreatePaiementDto } from './dto/create-paiement.dto';
import { UpdatePaiementDto } from './dto/update-paiement.dto';

export interface FindAllPaiementsParams {
  search?: string;
  idEleve?: number;
  idClasse?: number;
  idAnneeAcademique?: number;
  idModePaiement?: number;
  statut?: string;
  page?: number;
  limit?: number;
}

const PAIEMENT_INCLUDE = {
  scolarite: { include: { eleve: true, classe: true, anneeAcademique: true } },
  tranche: true,
  modePaiement: true,
};

const EPSILON = 0.01;

function computeSoldeFromScolarite(
  scolarite: { fraisInscription: number; fraisScolarite: number; reduction: number },
  montantPaye: number,
) {
  const montantAttendu = scolarite.fraisInscription + scolarite.fraisScolarite - scolarite.reduction;
  const reste = Math.max(0, Math.round((montantAttendu - montantPaye) * 100) / 100);
  const pourcentage =
    montantAttendu > 0 ? Math.min(100, Math.round((montantPaye / montantAttendu) * 10000) / 100) : 100;

  let statut: 'IMPAYE' | 'PARTIEL' | 'COMPLET';
  if (montantPaye <= 0) statut = 'IMPAYE';
  else if (montantPaye + EPSILON < montantAttendu) statut = 'PARTIEL';
  else statut = 'COMPLET';

  return { montantAttendu, montantPaye, reste, pourcentage, statut };
}

@Injectable()
export class PaiementService {
  constructor(private prisma: PrismaService) {}

  // ── ModePaiement (référence) ──────────────────────────────────────
  createModePaiement(dto: CreateModePaiementDto, idAdmin?: number) {
    return this.prisma.modePaiement.create({ data: { ...dto, idAdmin } });
  }

  findAllModePaiements(search?: string) {
    return this.prisma.modePaiement.findMany({
      where: search ? { libelle: { contains: search } } : undefined,
      orderBy: { libelle: 'asc' },
    });
  }

  async findOneModePaiement(id: number) {
    const mode = await this.prisma.modePaiement.findUnique({ where: { id } });
    if (!mode) throw new NotFoundException(`Mode de paiement #${id} introuvable`);
    return mode;
  }

  async updateModePaiement(id: number, dto: UpdateModePaiementDto) {
    await this.findOneModePaiement(id);
    return this.prisma.modePaiement.update({ where: { id }, data: dto });
  }

  async removeModePaiement(id: number) {
    await this.findOneModePaiement(id);
    return this.prisma.modePaiement.delete({ where: { id } });
  }

  // ── Tranche (référence) ───────────────────────────────────────────
  createTranche(dto: CreateTrancheDto, idAdmin?: number) {
    return this.prisma.tranche.create({
      data: { ...dto, echeance: new Date(dto.echeance), idAdmin },
    });
  }

  findAllTranches(search?: string) {
    return this.prisma.tranche.findMany({
      where: search ? { libelle: { contains: search } } : undefined,
      orderBy: { ordre: 'asc' },
    });
  }

  async findOneTranche(id: number) {
    const tranche = await this.prisma.tranche.findUnique({ where: { id } });
    if (!tranche) throw new NotFoundException(`Tranche #${id} introuvable`);
    return tranche;
  }

  async updateTranche(id: number, dto: UpdateTrancheDto) {
    await this.findOneTranche(id);
    const data: Prisma.TrancheUpdateInput = { ...dto };
    if (dto.echeance) data.echeance = new Date(dto.echeance);
    return this.prisma.tranche.update({ where: { id }, data });
  }

  async removeTranche(id: number) {
    await this.findOneTranche(id);
    return this.prisma.tranche.delete({ where: { id } });
  }

  // ── Scolarite (dossier de frais élève/année) ──────────────────────
  private assertReductionValide(fraisInscription: number, fraisScolarite: number, reduction: number) {
    if (reduction > fraisInscription + fraisScolarite) {
      throw new BadRequestException('La réduction ne peut pas dépasser le montant total des frais.');
    }
  }

  async createScolarite(dto: CreateScolariteDto, idAdmin?: number) {
    const eleve = await this.prisma.eleve.findUnique({ where: { id: dto.idEleve } });
    if (!eleve) throw new NotFoundException(`Eleve #${dto.idEleve} introuvable`);

    const annee = await this.prisma.anneeAcademique.findUnique({ where: { id: dto.idAnneeAcademique } });
    if (!annee) throw new NotFoundException(`Année académique #${dto.idAnneeAcademique} introuvable`);

    const classe = await this.prisma.classe.findUnique({ where: { id: dto.idClasse } });
    if (!classe) throw new NotFoundException(`Classe #${dto.idClasse} introuvable`);

    this.assertReductionValide(dto.fraisInscription ?? 0, dto.fraisScolarite ?? 0, dto.reduction ?? 0);

    try {
      return await this.prisma.scolarite.create({
        data: {
          ...dto,
          dateInscription: dto.dateInscription ? new Date(dto.dateInscription) : undefined,
          idAdmin,
        },
        include: { eleve: true, classe: true, anneeAcademique: true },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException('Cet élève a déjà une scolarité pour cette année académique.');
      }
      throw err;
    }
  }

  // Le solde est calculé et inclus directement dans chaque ligne pour éviter au
  // frontend de faire un appel N+1 vers /scolarites/:id/solde par ligne.
  async findAllScolarites(params: { idEleve?: number; idClasse?: number; idAnneeAcademique?: number } = {}) {
    const scolarites = await this.prisma.scolarite.findMany({
      where: {
        ...(params.idEleve ? { idEleve: params.idEleve } : {}),
        ...(params.idClasse ? { idClasse: params.idClasse } : {}),
        ...(params.idAnneeAcademique ? { idAnneeAcademique: params.idAnneeAcademique } : {}),
      },
      include: { eleve: true, classe: true, anneeAcademique: true, paiements: true },
      orderBy: { dateInscription: 'desc' },
    });

    return scolarites.map(({ paiements, ...scolarite }) => {
      const montantPaye = paiements.reduce((sum, p) => sum + p.montant, 0);
      return { ...scolarite, solde: computeSoldeFromScolarite(scolarite, montantPaye) };
    });
  }

  async findOneScolarite(id: number) {
    const scolarite = await this.prisma.scolarite.findUnique({
      where: { id },
      include: {
        eleve: true,
        classe: true,
        anneeAcademique: true,
        paiements: { include: { tranche: true, modePaiement: true }, orderBy: { datePaiement: 'desc' } },
      },
    });
    if (!scolarite) throw new NotFoundException(`Scolarité #${id} introuvable`);
    return scolarite;
  }

  async getSoldeScolarite(id: number, excludePaiementId?: number) {
    const scolarite = await this.findOneScolarite(id);
    const montantPaye = scolarite.paiements
      .filter((p) => p.id !== excludePaiementId)
      .reduce((sum, p) => sum + p.montant, 0);
    return { idScolarite: id, ...computeSoldeFromScolarite(scolarite, montantPaye) };
  }

  async updateScolarite(id: number, dto: UpdateScolariteDto) {
    const existing = await this.findOneScolarite(id);

    const fraisInscription = dto.fraisInscription ?? existing.fraisInscription;
    const fraisScolarite = dto.fraisScolarite ?? existing.fraisScolarite;
    const reduction = dto.reduction ?? existing.reduction;
    this.assertReductionValide(fraisInscription, fraisScolarite, reduction);

    if (dto.idEleve) {
      const eleve = await this.prisma.eleve.findUnique({ where: { id: dto.idEleve } });
      if (!eleve) throw new NotFoundException(`Eleve #${dto.idEleve} introuvable`);
    }
    if (dto.idAnneeAcademique) {
      const annee = await this.prisma.anneeAcademique.findUnique({ where: { id: dto.idAnneeAcademique } });
      if (!annee) throw new NotFoundException(`Année académique #${dto.idAnneeAcademique} introuvable`);
    }
    if (dto.idClasse) {
      const classe = await this.prisma.classe.findUnique({ where: { id: dto.idClasse } });
      if (!classe) throw new NotFoundException(`Classe #${dto.idClasse} introuvable`);
    }

    const data: Prisma.ScolariteUpdateInput = { ...dto };
    if (dto.dateInscription) data.dateInscription = new Date(dto.dateInscription);

    try {
      return await this.prisma.scolarite.update({
        where: { id },
        data,
        include: { eleve: true, classe: true, anneeAcademique: true },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException('Cet élève a déjà une scolarité pour cette année académique.');
      }
      throw err;
    }
  }

  async removeScolarite(id: number) {
    await this.findOneScolarite(id);
    return this.prisma.scolarite.delete({ where: { id } });
  }

  // ── Paiement (transactions) ───────────────────────────────────────
  async createPaiement(dto: CreatePaiementDto, idAdmin?: number) {
    const scolarite = await this.prisma.scolarite.findUnique({ where: { id: dto.idScolarite } });
    if (!scolarite) throw new NotFoundException(`Scolarité #${dto.idScolarite} introuvable`);

    const tranche = await this.prisma.tranche.findUnique({ where: { id: dto.idTranche } });
    if (!tranche) throw new NotFoundException(`Tranche #${dto.idTranche} introuvable`);

    const mode = await this.prisma.modePaiement.findUnique({ where: { id: dto.idModePaiement } });
    if (!mode) throw new NotFoundException(`Mode de paiement #${dto.idModePaiement} introuvable`);

    const solde = await this.getSoldeScolarite(dto.idScolarite);
    if (dto.montant > solde.reste + EPSILON) {
      throw new BadRequestException(
        `Le montant (${dto.montant}) dépasse le reste à payer (${solde.reste}).`,
      );
    }

    return this.prisma.paiement.create({
      data: {
        ...dto,
        datePaiement: dto.datePaiement ? new Date(dto.datePaiement) : undefined,
        idAdmin,
      },
      include: PAIEMENT_INCLUDE,
    });
  }

  async findAllPaiements(params: FindAllPaiementsParams = {}) {
    const page = params.page && params.page > 0 ? params.page : 1;
    const limit = params.limit && params.limit > 0 ? params.limit : 20;

    // Le statut n'est pas stocké : il est dérivé des frais/paiements de la scolarité.
    // On calcule d'abord la liste des scolarités correspondant au statut demandé.
    let scolariteIdsForStatut: number[] | undefined;
    if (params.statut) {
      const scolarites = await this.prisma.scolarite.findMany({ include: { paiements: true } });
      scolariteIdsForStatut = scolarites
        .filter((s) => {
          const montantPaye = s.paiements.reduce((sum, p) => sum + p.montant, 0);
          return computeSoldeFromScolarite(s, montantPaye).statut === params.statut;
        })
        .map((s) => s.id);
    }

    const where: Prisma.PaiementWhereInput = {
      ...(params.idModePaiement ? { idModePaiement: params.idModePaiement } : {}),
      ...(scolariteIdsForStatut ? { idScolarite: { in: scolariteIdsForStatut } } : {}),
      ...(params.idEleve || params.idClasse || params.idAnneeAcademique
        ? {
            scolarite: {
              ...(params.idEleve ? { idEleve: params.idEleve } : {}),
              ...(params.idClasse ? { idClasse: params.idClasse } : {}),
              ...(params.idAnneeAcademique ? { idAnneeAcademique: params.idAnneeAcademique } : {}),
            },
          }
        : {}),
      ...(params.search
        ? {
            OR: [
              { reference: { contains: params.search } },
              { recuNumero: { contains: params.search } },
              { scolarite: { eleve: { nom: { contains: params.search } } } },
              { scolarite: { eleve: { prenom: { contains: params.search } } } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.paiement.findMany({
        where,
        include: PAIEMENT_INCLUDE,
        orderBy: { datePaiement: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.paiement.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findOnePaiement(id: number) {
    const paiement = await this.prisma.paiement.findUnique({ where: { id }, include: PAIEMENT_INCLUDE });
    if (!paiement) throw new NotFoundException(`Paiement #${id} introuvable`);
    return paiement;
  }

  async updatePaiement(id: number, dto: UpdatePaiementDto) {
    const existing = await this.findOnePaiement(id);

    if (dto.idScolarite) {
      const scolarite = await this.prisma.scolarite.findUnique({ where: { id: dto.idScolarite } });
      if (!scolarite) throw new NotFoundException(`Scolarité #${dto.idScolarite} introuvable`);
    }
    if (dto.idTranche) {
      const tranche = await this.prisma.tranche.findUnique({ where: { id: dto.idTranche } });
      if (!tranche) throw new NotFoundException(`Tranche #${dto.idTranche} introuvable`);
    }
    if (dto.idModePaiement) {
      const mode = await this.prisma.modePaiement.findUnique({ where: { id: dto.idModePaiement } });
      if (!mode) throw new NotFoundException(`Mode de paiement #${dto.idModePaiement} introuvable`);
    }

    if (dto.montant !== undefined) {
      const scolariteId = dto.idScolarite ?? existing.idScolarite;
      const solde = await this.getSoldeScolarite(scolariteId, id);
      if (dto.montant > solde.reste + EPSILON) {
        throw new BadRequestException(
          `Le montant (${dto.montant}) dépasse le reste à payer (${solde.reste}).`,
        );
      }
    }

    const data: Prisma.PaiementUpdateInput = { ...dto };
    if (dto.datePaiement) data.datePaiement = new Date(dto.datePaiement);

    return this.prisma.paiement.update({ where: { id }, data, include: PAIEMENT_INCLUDE });
  }

  async removePaiement(id: number) {
    await this.findOnePaiement(id);
    return this.prisma.paiement.delete({ where: { id } });
  }

  // Historique complet des paiements d'un élève (toutes années académiques),
  // avec calcul automatique du solde par année — entièrement dérivé des données
  // existantes, aucune nouvelle relation.
  async getHistoriqueEleve(idEleve: number) {
    const eleve = await this.prisma.eleve.findUnique({ where: { id: idEleve } });
    if (!eleve) throw new NotFoundException(`Eleve #${idEleve} introuvable`);

    const scolarites = await this.prisma.scolarite.findMany({
      where: { idEleve },
      include: {
        anneeAcademique: true,
        classe: true,
        paiements: { include: { tranche: true, modePaiement: true }, orderBy: { datePaiement: 'desc' } },
      },
      orderBy: { dateInscription: 'desc' },
    });

    const parAnnee = scolarites.map((s) => {
      const montantPaye = s.paiements.reduce((sum, p) => sum + p.montant, 0);
      const solde = computeSoldeFromScolarite(s, montantPaye);
      return {
        idScolarite: s.id,
        anneeAcademique: s.anneeAcademique.libelle,
        classe: s.classe.libelle,
        statutScolarite: s.statut,
        ...solde,
        paiements: s.paiements,
      };
    });

    return { idEleve, parAnnee };
  }
}
