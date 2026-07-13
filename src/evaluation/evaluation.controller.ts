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
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { TypeEpreuve } from '@prisma/client';
import { EvaluationService, Requester } from './evaluation.service';
import { CreateEpreuveDto } from './dto/create-epreuve.dto';
import { UpdateEpreuveDto } from './dto/update-epreuve.dto';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

interface AuthenticatedRequest {
  user: Requester;
}

@ApiTags('Évaluations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'enseignant')
@Controller('evaluations')
export class EvaluationController {
  constructor(private evaluationService: EvaluationService) {}

  // ── Epreuve ──────────────────────────────────────────────────────
  @Post('epreuves')
  @ApiOperation({ summary: "Créer une épreuve (un enseignant doit préciser le cours ; vérifie qu'il l'enseigne réellement dans cette classe)" })
  createEpreuve(@Body() dto: CreateEpreuveDto, @Req() req: AuthenticatedRequest) {
    return this.evaluationService.createEpreuve(dto, req.user);
  }

  @Get('epreuves')
  @ApiOperation({
    summary: 'Lister les épreuves (tableau complet par défaut, paginé si page/limit fournis) — un enseignant ne voit que les siennes',
  })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'cours', required: false, type: Number })
  @ApiQuery({ name: 'classe', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, enum: TypeEpreuve })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllEpreuves(
    @Req() req: AuthenticatedRequest,
    @Query('search') search?: string,
    @Query('cours') cours?: string,
    @Query('classe') classe?: string,
    @Query('type') type?: TypeEpreuve,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.evaluationService.findAllEpreuves(
      {
        search,
        idCours: cours ? parseInt(cours, 10) : undefined,
        idClasse: classe ? parseInt(classe, 10) : undefined,
        typeEpreuve: type || undefined,
        page: page ? parseInt(page, 10) : undefined,
        limit: limit ? parseInt(limit, 10) : undefined,
      },
      req.user,
    );
  }

  @Get('epreuves/:id')
  @ApiOperation({ summary: "Obtenir une épreuve par ID (avec évaluations) — un enseignant ne peut consulter que les siennes" })
  findOneEpreuve(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
    return this.evaluationService.findOneEpreuve(id, req.user);
  }

  @Get('epreuves/:id/stats')
  @ApiOperation({ summary: 'Statistiques de classe pour une épreuve (moyenne, min, max, classement)' })
  getStatsEpreuve(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
    return this.evaluationService.getStatsEpreuve(id, req.user);
  }

  @Put('epreuves/:id')
  @ApiOperation({ summary: "Modifier une épreuve — un enseignant ne peut modifier que les siennes" })
  updateEpreuve(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEpreuveDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.evaluationService.updateEpreuve(id, dto, req.user);
  }

  @Delete('epreuves/:id')
  @ApiOperation({ summary: "Supprimer une épreuve — un enseignant ne peut supprimer que les siennes" })
  deleteEpreuve(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
    return this.evaluationService.deleteEpreuve(id, req.user);
  }

  // ── Evaluation (notes) ───────────────────────────────────────────
  @Post('notes')
  @ApiOperation({ summary: "Créer une évaluation/note (recalcule automatiquement le classement) — uniquement sur ses propres épreuves pour un enseignant" })
  createEvaluation(@Body() dto: CreateEvaluationDto, @Req() req: AuthenticatedRequest) {
    return this.evaluationService.createEvaluation(dto, req.user);
  }

  @Get('notes')
  @Roles('admin', 'enseignant', 'eleve')
  @ApiOperation({ summary: 'Lister les évaluations (paginé, recherche et filtres optionnels) — un élève ne voit que les siennes, un enseignant que celles de ses épreuves' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'eleveId', required: false, type: Number })
  @ApiQuery({ name: 'epreuveId', required: false, type: Number })
  @ApiQuery({ name: 'classe', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllEvaluations(
    @Req() req: AuthenticatedRequest,
    @Query('search') search?: string,
    @Query('eleveId') eleveId?: string,
    @Query('epreuveId') epreuveId?: string,
    @Query('classe') classe?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.evaluationService.findAllEvaluations(
      {
        search,
        idEleve: eleveId ? parseInt(eleveId, 10) : undefined,
        idEpreuve: epreuveId ? parseInt(epreuveId, 10) : undefined,
        idClasse: classe ? parseInt(classe, 10) : undefined,
        page: page ? parseInt(page, 10) : undefined,
        limit: limit ? parseInt(limit, 10) : undefined,
      },
      req.user,
    );
  }

  @Get('notes/:id')
  @Roles('admin', 'enseignant', 'eleve')
  @ApiOperation({ summary: 'Obtenir une évaluation par ID' })
  findOneEvaluation(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
    return this.evaluationService.findOneEvaluation(id, req.user);
  }

  @Put('notes/:id')
  @ApiOperation({ summary: 'Modifier une évaluation (recalcule automatiquement le classement)' })
  updateEvaluation(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEvaluationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.evaluationService.updateEvaluation(id, dto, req.user);
  }

  @Delete('notes/:id')
  @ApiOperation({ summary: 'Supprimer une évaluation (recalcule automatiquement le classement)' })
  deleteEvaluation(@Param('id', ParseIntPipe) id: number, @Req() req: AuthenticatedRequest) {
    return this.evaluationService.deleteEvaluation(id, req.user);
  }

  // ── Moyennes ─────────────────────────────────────────────────────
  @Get('eleves/:idEleve/moyenne-cours/:idCours')
  @Roles('admin', 'enseignant', 'eleve')
  @ApiOperation({ summary: "Moyenne pondérée d'un élève sur un cours — un élève ne peut consulter que la sienne" })
  getMoyenneEleveCours(
    @Param('idEleve', ParseIntPipe) idEleve: number,
    @Param('idCours', ParseIntPipe) idCours: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.evaluationService.getMoyenneEleveCours(idEleve, idCours, req.user);
  }

  @Get('eleves/:idEleve/bulletin')
  @Roles('admin', 'enseignant', 'eleve')
  @ApiOperation({ summary: "Bulletin d'un élève : moyenne par cours et moyenne générale — un élève ne peut consulter que le sien" })
  getBulletinEleve(@Param('idEleve', ParseIntPipe) idEleve: number, @Req() req: AuthenticatedRequest) {
    return this.evaluationService.getBulletinEleve(idEleve, req.user);
  }
}
