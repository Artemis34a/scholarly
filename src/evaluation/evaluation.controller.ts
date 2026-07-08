import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { EvaluationService } from './evaluation.service';
import { CreateNatureEpreuveDto } from './dto/create-nature-epreuve.dto';
import { UpdateNatureEpreuveDto } from './dto/update-nature-epreuve.dto';
import { CreateEpreuveDto } from './dto/create-epreuve.dto';
import { UpdateEpreuveDto } from './dto/update-epreuve.dto';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Évaluations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('evaluations')
export class EvaluationController {
  constructor(private evaluationService: EvaluationService) {}

  // ── Nature Epreuve ──────────────────────────────────────────────
  @Post('nature-epreuves')
  @ApiOperation({ summary: "Créer une nature d'épreuve" })
  createNatureEpreuve(
    @Body() dto: CreateNatureEpreuveDto,
    @Query('adminId') adminId?: number,
  ) {
    return this.evaluationService.createNatureEpreuve(
      dto,
      adminId ? +adminId : undefined,
    );
  }

  @Get('nature-epreuves')
  @ApiOperation({ summary: "Lister toutes les natures d'épreuves" })
  @ApiQuery({ name: 'search', required: false })
  findAllNatureEpreuves(@Query('search') search?: string) {
    return this.evaluationService.findAllNatureEpreuves(search);
  }

  @Get('nature-epreuves/:id')
  @ApiOperation({ summary: "Obtenir une nature d'épreuve par ID" })
  findOneNatureEpreuve(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationService.findOneNatureEpreuve(id);
  }

  @Put('nature-epreuves/:id')
  @ApiOperation({ summary: "Modifier une nature d'épreuve" })
  updateNatureEpreuve(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNatureEpreuveDto,
  ) {
    return this.evaluationService.updateNatureEpreuve(id, dto);
  }

  @Delete('nature-epreuves/:id')
  @ApiOperation({ summary: "Supprimer une nature d'épreuve" })
  deleteNatureEpreuve(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationService.deleteNatureEpreuve(id);
  }

  // ── Epreuve ──────────────────────────────────────────────────────
  @Post('epreuves')
  @ApiOperation({ summary: 'Créer une épreuve' })
  createEpreuve(
    @Body() dto: CreateEpreuveDto,
    @Query('adminId') adminId?: number,
  ) {
    return this.evaluationService.createEpreuve(
      dto,
      adminId ? +adminId : undefined,
    );
  }

  @Get('epreuves')
  @ApiOperation({
    summary: 'Lister les épreuves (tableau complet par défaut, paginé si page/limit fournis)',
  })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'cours', required: false, type: Number })
  @ApiQuery({ name: 'classe', required: false, type: Number })
  @ApiQuery({ name: 'nature', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllEpreuves(
    @Query('search') search?: string,
    @Query('cours') cours?: string,
    @Query('classe') classe?: string,
    @Query('nature') nature?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.evaluationService.findAllEpreuves({
      search,
      idCours: cours ? parseInt(cours, 10) : undefined,
      idClasse: classe ? parseInt(classe, 10) : undefined,
      idNatureEpreuve: nature ? parseInt(nature, 10) : undefined,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('epreuves/:id')
  @ApiOperation({ summary: 'Obtenir une épreuve par ID (avec évaluations)' })
  findOneEpreuve(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationService.findOneEpreuve(id);
  }

  @Get('epreuves/:id/stats')
  @ApiOperation({ summary: 'Statistiques de classe pour une épreuve (moyenne, min, max)' })
  getStatsEpreuve(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationService.getStatsEpreuve(id);
  }

  @Put('epreuves/:id')
  @ApiOperation({ summary: 'Modifier une épreuve' })
  updateEpreuve(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEpreuveDto,
  ) {
    return this.evaluationService.updateEpreuve(id, dto);
  }

  @Delete('epreuves/:id')
  @ApiOperation({ summary: 'Supprimer une épreuve' })
  deleteEpreuve(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationService.deleteEpreuve(id);
  }

  // ── Evaluation (notes) ───────────────────────────────────────────
  @Post('notes')
  @ApiOperation({ summary: 'Créer une évaluation/note (recalcule automatiquement le classement)' })
  createEvaluation(
    @Body() dto: CreateEvaluationDto,
    @Query('adminId') adminId?: number,
  ) {
    return this.evaluationService.createEvaluation(
      dto,
      adminId ? +adminId : undefined,
    );
  }

  @Get('notes')
  @ApiOperation({ summary: 'Lister les évaluations (paginé, recherche et filtres optionnels)' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'eleveId', required: false, type: Number })
  @ApiQuery({ name: 'epreuveId', required: false, type: Number })
  @ApiQuery({ name: 'classe', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllEvaluations(
    @Query('search') search?: string,
    @Query('eleveId') eleveId?: string,
    @Query('epreuveId') epreuveId?: string,
    @Query('classe') classe?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.evaluationService.findAllEvaluations({
      search,
      idEleve: eleveId ? parseInt(eleveId, 10) : undefined,
      idEpreuve: epreuveId ? parseInt(epreuveId, 10) : undefined,
      idClasse: classe ? parseInt(classe, 10) : undefined,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('notes/:id')
  @ApiOperation({ summary: 'Obtenir une évaluation par ID' })
  findOneEvaluation(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationService.findOneEvaluation(id);
  }

  @Put('notes/:id')
  @ApiOperation({ summary: 'Modifier une évaluation (recalcule automatiquement le classement)' })
  updateEvaluation(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEvaluationDto,
  ) {
    return this.evaluationService.updateEvaluation(id, dto);
  }

  @Delete('notes/:id')
  @ApiOperation({ summary: 'Supprimer une évaluation (recalcule automatiquement le classement)' })
  deleteEvaluation(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationService.deleteEvaluation(id);
  }

  // ── Moyennes ─────────────────────────────────────────────────────
  @Get('eleves/:idEleve/moyenne-cours/:idCours')
  @ApiOperation({ summary: "Moyenne pondérée d'un élève sur un cours" })
  getMoyenneEleveCours(
    @Param('idEleve', ParseIntPipe) idEleve: number,
    @Param('idCours', ParseIntPipe) idCours: number,
  ) {
    return this.evaluationService.getMoyenneEleveCours(idEleve, idCours);
  }

  @Get('eleves/:idEleve/bulletin')
  @ApiOperation({ summary: "Bulletin d'un élève : moyenne par cours et moyenne générale" })
  getBulletinEleve(@Param('idEleve', ParseIntPipe) idEleve: number) {
    return this.evaluationService.getBulletinEleve(idEleve);
  }
}
