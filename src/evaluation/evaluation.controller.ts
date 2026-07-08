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
import { CreateEpreuveDto } from './dto/create-epreuve.dto';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Évaluations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('evaluations')
export class EvaluationController {
  constructor(private evaluationService: EvaluationService) {}

  // Nature Epreuve endpoints
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
  findAllNatureEpreuves() {
    return this.evaluationService.findAllNatureEpreuves();
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
    @Body() dto: CreateNatureEpreuveDto,
  ) {
    return this.evaluationService.updateNatureEpreuve(id, dto);
  }

  @Delete('nature-epreuves/:id')
  @ApiOperation({ summary: "Supprimer une nature d'épreuve" })
  deleteNatureEpreuve(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationService.deleteNatureEpreuve(id);
  }

  // Epreuve endpoints
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
  @ApiOperation({ summary: 'Lister toutes les épreuves' })
  findAllEpreuves() {
    return this.evaluationService.findAllEpreuves();
  }

  @Get('epreuves/:id')
  @ApiOperation({ summary: 'Obtenir une épreuve par ID' })
  findOneEpreuve(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationService.findOneEpreuve(id);
  }

  @Put('epreuves/:id')
  @ApiOperation({ summary: 'Modifier une épreuve' })
  updateEpreuve(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateEpreuveDto,
  ) {
    return this.evaluationService.updateEpreuve(id, dto);
  }

  @Delete('epreuves/:id')
  @ApiOperation({ summary: 'Supprimer une épreuve' })
  deleteEpreuve(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationService.deleteEpreuve(id);
  }

  // Evaluation endpoints
  @Post('notes')
  @ApiOperation({ summary: 'Créer une évaluation/note' })
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
  @ApiOperation({ summary: 'Lister toutes les évaluations' })
  @ApiQuery({ name: 'eleveId', required: false, type: Number })
  @ApiQuery({ name: 'epreuveId', required: false, type: Number })
  findAllEvaluations(
    @Query('eleveId') eleveId?: number,
    @Query('epreuveId') epreuveId?: number,
  ) {
    if (eleveId) return this.evaluationService.findEvaluationsByEleve(+eleveId);
    if (epreuveId)
      return this.evaluationService.findEvaluationsByEpreuve(+epreuveId);
    return this.evaluationService.findAllEvaluations();
  }

  @Get('notes/:id')
  @ApiOperation({ summary: 'Obtenir une évaluation par ID' })
  findOneEvaluation(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationService.findOneEvaluation(id);
  }

  @Put('notes/:id')
  @ApiOperation({ summary: 'Modifier une évaluation' })
  updateEvaluation(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateEvaluationDto,
  ) {
    return this.evaluationService.updateEvaluation(id, dto);
  }

  @Delete('notes/:id')
  @ApiOperation({ summary: 'Supprimer une évaluation' })
  deleteEvaluation(@Param('id', ParseIntPipe) id: number) {
    return this.evaluationService.deleteEvaluation(id);
  }
}
