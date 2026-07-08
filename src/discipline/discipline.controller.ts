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
import { CreateRapportDto } from './dto/create-rapport.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Discipline')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('discipline')
export class DisciplineController {
  constructor(private disciplineService: DisciplineService) {}

  // Discipline endpoints
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
  @ApiOperation({ summary: 'Lister toutes les disciplines' })
  findAllDisciplines() {
    return this.disciplineService.findAllDisciplines();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une discipline par ID' })
  findOneDiscipline(@Param('id', ParseIntPipe) id: number) {
    return this.disciplineService.findOneDiscipline(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier une discipline' })
  updateDiscipline(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateDisciplineDto,
  ) {
    return this.disciplineService.updateDiscipline(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une discipline' })
  deleteDiscipline(@Param('id', ParseIntPipe) id: number) {
    return this.disciplineService.deleteDiscipline(id);
  }

  // Rapport endpoints
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
  @ApiOperation({ summary: 'Lister tous les rapports' })
  @ApiQuery({ name: 'eleveId', required: false, type: Number })
  @ApiQuery({ name: 'disciplineId', required: false, type: Number })
  @ApiQuery({ name: 'statut', required: false, type: String })
  findAllRapports(
    @Query('eleveId') eleveId?: number,
    @Query('disciplineId') disciplineId?: number,
    @Query('statut') statut?: string,
  ) {
    if (eleveId) return this.disciplineService.findRapportsByEleve(+eleveId);
    if (disciplineId)
      return this.disciplineService.findRapportsByDiscipline(+disciplineId);
    if (statut) return this.disciplineService.findRapportsByStatut(statut);
    return this.disciplineService.findAllRapports();
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
    @Body() dto: CreateRapportDto,
  ) {
    return this.disciplineService.updateRapport(id, dto);
  }

  @Delete('rapports/:id')
  @ApiOperation({ summary: 'Supprimer un rapport' })
  deleteRapport(@Param('id', ParseIntPipe) id: number) {
    return this.disciplineService.deleteRapport(id);
  }
}
