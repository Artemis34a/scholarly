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
import { DisciplineService } from './discipline.service';
import { CreateDisciplineDto } from './dto/create-discipline.dto';
import { UpdateDisciplineDto } from './dto/update-discipline.dto';
import { CreateRapportDto } from './dto/create-rapport.dto';
import { UpdateRapportDto } from './dto/update-rapport.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Discipline')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('discipline')
export class DisciplineController {
  constructor(private disciplineService: DisciplineService) {}

  // ── Discipline (routes fixes, doivent precéder ':id' pour ne pas être
  // capturées par le paramètre dynamique — même profondeur de chemin) ─────
  @Post()
  @ApiOperation({ summary: 'Créer une discipline' })
  createDiscipline(
    @Body() dto: CreateDisciplineDto,
    @Query('adminId') adminId?: number,
  ) {
    return this.disciplineService.createDiscipline(
      dto,
      adminId ? +adminId : undefined,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Lister les disciplines (tableau complet par défaut, paginé si page/limit fournis)',
  })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'estFaute', required: false, type: Boolean })
  @ApiQuery({ name: 'gravite', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllDisciplines(
    @Query('search') search?: string,
    @Query('estFaute') estFaute?: string,
    @Query('gravite') gravite?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.disciplineService.findAllDisciplines({
      search,
      estFaute: estFaute !== undefined ? estFaute === 'true' : undefined,
      gravite: gravite ? parseInt(gravite, 10) : undefined,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  // ── Rapport (incidents) — routes fixes sous /discipline, déclarées avant
  // /discipline/:id pour éviter que ':id' ne capture 'rapports' ────────────
  @Post('rapports')
  @ApiOperation({ summary: 'Créer un rapport disciplinaire' })
  createRapport(
    @Body() dto: CreateRapportDto,
    @Query('adminId') adminId?: number,
  ) {
    return this.disciplineService.createRapport(
      dto,
      adminId ? +adminId : undefined,
    );
  }

  @Get('rapports')
  @ApiOperation({ summary: 'Lister les rapports (paginé, recherche et filtres optionnels)' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'eleveId', required: false, type: Number })
  @ApiQuery({ name: 'disciplineId', required: false, type: Number })
  @ApiQuery({ name: 'statut', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllRapports(
    @Query('search') search?: string,
    @Query('eleveId') eleveId?: string,
    @Query('disciplineId') disciplineId?: string,
    @Query('statut') statut?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.disciplineService.findAllRapports({
      search,
      idEleve: eleveId ? parseInt(eleveId, 10) : undefined,
      idDiscipline: disciplineId ? parseInt(disciplineId, 10) : undefined,
      statut,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('rapports/:id')
  @ApiOperation({ summary: 'Obtenir un rapport par ID' })
  findOneRapport(@Param('id', ParseIntPipe) id: number) {
    return this.disciplineService.findOneRapport(id);
  }

  @Put('rapports/:id')
  @ApiOperation({ summary: 'Modifier un rapport' })
  updateRapport(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRapportDto,
  ) {
    return this.disciplineService.updateRapport(id, dto);
  }

  @Delete('rapports/:id')
  @ApiOperation({ summary: 'Supprimer un rapport' })
  deleteRapport(@Param('id', ParseIntPipe) id: number) {
    return this.disciplineService.deleteRapport(id);
  }

  // ── Historique — également une route fixe, avant ':id' ──────────────────
  @Get('eleves/:idEleve/historique')
  @Roles('admin', 'eleve')
  @ApiOperation({ summary: "Historique disciplinaire complet d'un élève" })
  getHistoriqueEleve(@Param('idEleve', ParseIntPipe) idEleve: number) {
    return this.disciplineService.getHistoriqueEleve(idEleve);
  }

  // ── Discipline : routes paramétrées, déclarées en dernier ────────────────
  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une discipline par ID (avec ses rapports)' })
  findOneDiscipline(@Param('id', ParseIntPipe) id: number) {
    return this.disciplineService.findOneDiscipline(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier une discipline' })
  updateDiscipline(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDisciplineDto,
  ) {
    return this.disciplineService.updateDiscipline(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une discipline' })
  deleteDiscipline(@Param('id', ParseIntPipe) id: number) {
    return this.disciplineService.deleteDiscipline(id);
  }
}
