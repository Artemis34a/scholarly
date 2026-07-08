import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PaiementService } from './paiement.service';
import { CreateModePaiementDto } from './dto/create-mode-paiement.dto';
import { UpdateModePaiementDto } from './dto/update-mode-paiement.dto';
import { CreateTrancheDto } from './dto/create-tranche.dto';
import { UpdateTrancheDto } from './dto/update-tranche.dto';
import { CreateScolariteDto } from './dto/create-scolarite.dto';
import { UpdateScolariteDto } from './dto/update-scolarite.dto';
import { CreatePaiementDto } from './dto/create-paiement.dto';
import { UpdatePaiementDto } from './dto/update-paiement.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Paiements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('paiements')
export class PaiementController {
  constructor(private paiementService: PaiementService) {}

  // ── ModePaiement — routes fixes, déclarées avant ':id' ────────────
  @Post('modes')
  @ApiOperation({ summary: 'Créer un mode de paiement' })
  createModePaiement(@Body() dto: CreateModePaiementDto, @Query('adminId') adminId?: number) {
    return this.paiementService.createModePaiement(dto, adminId ? +adminId : undefined);
  }

  @Get('modes')
  @ApiOperation({ summary: 'Lister les modes de paiement' })
  @ApiQuery({ name: 'search', required: false })
  findAllModePaiements(@Query('search') search?: string) {
    return this.paiementService.findAllModePaiements(search);
  }

  @Get('modes/:id')
  @ApiOperation({ summary: 'Obtenir un mode de paiement' })
  findOneModePaiement(@Param('id', ParseIntPipe) id: number) {
    return this.paiementService.findOneModePaiement(id);
  }

  @Put('modes/:id')
  @ApiOperation({ summary: 'Modifier un mode de paiement' })
  updateModePaiement(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateModePaiementDto) {
    return this.paiementService.updateModePaiement(id, dto);
  }

  @Delete('modes/:id')
  @ApiOperation({ summary: 'Supprimer un mode de paiement' })
  removeModePaiement(@Param('id', ParseIntPipe) id: number) {
    return this.paiementService.removeModePaiement(id);
  }

  // ── Tranche — routes fixes ─────────────────────────────────────────
  @Post('tranches')
  @ApiOperation({ summary: 'Créer une tranche' })
  createTranche(@Body() dto: CreateTrancheDto, @Query('adminId') adminId?: number) {
    return this.paiementService.createTranche(dto, adminId ? +adminId : undefined);
  }

  @Get('tranches')
  @ApiOperation({ summary: 'Lister les tranches' })
  @ApiQuery({ name: 'search', required: false })
  findAllTranches(@Query('search') search?: string) {
    return this.paiementService.findAllTranches(search);
  }

  @Get('tranches/:id')
  @ApiOperation({ summary: 'Obtenir une tranche' })
  findOneTranche(@Param('id', ParseIntPipe) id: number) {
    return this.paiementService.findOneTranche(id);
  }

  @Put('tranches/:id')
  @ApiOperation({ summary: 'Modifier une tranche' })
  updateTranche(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTrancheDto) {
    return this.paiementService.updateTranche(id, dto);
  }

  @Delete('tranches/:id')
  @ApiOperation({ summary: 'Supprimer une tranche' })
  removeTranche(@Param('id', ParseIntPipe) id: number) {
    return this.paiementService.removeTranche(id);
  }

  // ── Scolarite — routes fixes ────────────────────────────────────────
  @Post('scolarites')
  @ApiOperation({ summary: "Créer une scolarité (dossier de frais élève/année)" })
  createScolarite(@Body() dto: CreateScolariteDto, @Query('adminId') adminId?: number) {
    return this.paiementService.createScolarite(dto, adminId ? +adminId : undefined);
  }

  @Get('scolarites')
  @ApiOperation({ summary: 'Lister les scolarités (filtres élève/classe/année)' })
  @ApiQuery({ name: 'eleveId', required: false, type: Number })
  @ApiQuery({ name: 'classeId', required: false, type: Number })
  @ApiQuery({ name: 'anneeId', required: false, type: Number })
  findAllScolarites(
    @Query('eleveId') eleveId?: string,
    @Query('classeId') classeId?: string,
    @Query('anneeId') anneeId?: string,
  ) {
    return this.paiementService.findAllScolarites({
      idEleve: eleveId ? parseInt(eleveId, 10) : undefined,
      idClasse: classeId ? parseInt(classeId, 10) : undefined,
      idAnneeAcademique: anneeId ? parseInt(anneeId, 10) : undefined,
    });
  }

  @Get('scolarites/:id')
  @ApiOperation({ summary: 'Obtenir une scolarité (avec ses paiements)' })
  findOneScolarite(@Param('id', ParseIntPipe) id: number) {
    return this.paiementService.findOneScolarite(id);
  }

  @Get('scolarites/:id/solde')
  @ApiOperation({ summary: 'Solde calculé automatiquement (payé, reste, %, statut)' })
  getSoldeScolarite(@Param('id', ParseIntPipe) id: number) {
    return this.paiementService.getSoldeScolarite(id);
  }

  @Put('scolarites/:id')
  @ApiOperation({ summary: 'Modifier une scolarité' })
  updateScolarite(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateScolariteDto) {
    return this.paiementService.updateScolarite(id, dto);
  }

  @Delete('scolarites/:id')
  @ApiOperation({ summary: 'Supprimer une scolarité' })
  removeScolarite(@Param('id', ParseIntPipe) id: number) {
    return this.paiementService.removeScolarite(id);
  }

  // ── Historique — route fixe ──────────────────────────────────────────
  @Get('eleves/:idEleve/historique')
  @ApiOperation({ summary: "Historique complet des paiements d'un élève (toutes années)" })
  getHistoriqueEleve(@Param('idEleve', ParseIntPipe) idEleve: number) {
    return this.paiementService.getHistoriqueEleve(idEleve);
  }

  // ── Paiement — CRUD principal, routes paramétrées déclarées en dernier ──
  @Post()
  @ApiOperation({ summary: 'Enregistrer un paiement (vérifie le reste à payer)' })
  createPaiement(@Body() dto: CreatePaiementDto, @Query('adminId') adminId?: number) {
    return this.paiementService.createPaiement(dto, adminId ? +adminId : undefined);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les paiements (paginé, recherche et filtres)' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'eleveId', required: false, type: Number })
  @ApiQuery({ name: 'classeId', required: false, type: Number })
  @ApiQuery({ name: 'anneeId', required: false, type: Number })
  @ApiQuery({ name: 'modeId', required: false, type: Number })
  @ApiQuery({ name: 'statut', required: false, enum: ['IMPAYE', 'PARTIEL', 'COMPLET'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllPaiements(
    @Query('search') search?: string,
    @Query('eleveId') eleveId?: string,
    @Query('classeId') classeId?: string,
    @Query('anneeId') anneeId?: string,
    @Query('modeId') modeId?: string,
    @Query('statut') statut?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.paiementService.findAllPaiements({
      search,
      idEleve: eleveId ? parseInt(eleveId, 10) : undefined,
      idClasse: classeId ? parseInt(classeId, 10) : undefined,
      idAnneeAcademique: anneeId ? parseInt(anneeId, 10) : undefined,
      idModePaiement: modeId ? parseInt(modeId, 10) : undefined,
      statut,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un paiement' })
  findOnePaiement(@Param('id', ParseIntPipe) id: number) {
    return this.paiementService.findOnePaiement(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un paiement (revérifie le reste à payer)' })
  updatePaiement(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePaiementDto) {
    return this.paiementService.updatePaiement(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un paiement' })
  removePaiement(@Param('id', ParseIntPipe) id: number) {
    return this.paiementService.removePaiement(id);
  }
}
