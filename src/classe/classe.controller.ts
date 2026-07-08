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
import { ClasseService } from './classe.service';
import { CreateClasseDto } from './dto/create-classe.dto';
import { UpdateClasseDto } from './dto/update-classe.dto';
import { AssignTitulaireDto } from './dto/assign-titulaire.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Classes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('classes')
export class ClasseController {
  constructor(private classeService: ClasseService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une classe (une salle principale est créée automatiquement)' })
  create(@Body() dto: CreateClasseDto) {
    return this.classeService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les classes (paginé, recherche et filtre par cycle optionnels)' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'cycle', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('search') search?: string,
    @Query('cycle') cycle?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.classeService.findAll({
      search,
      idCycle: cycle ? parseInt(cycle, 10) : undefined,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une classe (cycle, salle principale, titulaire, cours)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.classeService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier une classe' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateClasseDto) {
    return this.classeService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une classe' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.classeService.remove(id);
  }

  @Get(':id/eleves')
  @ApiOperation({ summary: 'Lister les élèves inscrits dans la classe' })
  findEleves(@Param('id', ParseIntPipe) id: number) {
    return this.classeService.findEleves(id);
  }

  @Get(':id/titulaire')
  @ApiOperation({ summary: 'Obtenir le titulaire actuel de la classe (ou null)' })
  getTitulaire(@Param('id', ParseIntPipe) id: number) {
    return this.classeService.getTitulaire(id);
  }

  @Put(':id/titulaire')
  @ApiOperation({ summary: 'Affecter (ou remplacer) le titulaire de la classe' })
  assignTitulaire(@Param('id', ParseIntPipe) id: number, @Body() dto: AssignTitulaireDto) {
    return this.classeService.assignTitulaire(id, dto);
  }

  @Delete(':id/titulaire')
  @ApiOperation({ summary: 'Retirer le titulaire de la classe' })
  removeTitulaire(@Param('id', ParseIntPipe) id: number) {
    return this.classeService.removeTitulaire(id);
  }
}
