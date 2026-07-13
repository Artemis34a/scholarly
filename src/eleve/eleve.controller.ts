import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { EleveService } from './eleve.service';
import { CreateEleveDto } from './dto/create-eleve.dto';
import { UpdateEleveDto } from './dto/update-eleve.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Élèves')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('eleves')
export class EleveController {
  constructor(private eleveService: EleveService) {}

  @Post()
  @ApiOperation({ summary: 'Inscrire un élève' })
  create(@Body() dto: CreateEleveDto) { return this.eleveService.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Lister les élèves (paginé, recherche optionnelle)' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.eleveService.findAll({
      search,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('actifs')
  @ApiOperation({ summary: 'Élèves actifs' })
  findActifs() { return this.eleveService.findActifs(); }

  @Get(':matricule')
  @Roles('admin', 'eleve')
  @ApiOperation({ summary: 'Obtenir un élève par matricule' })
  findOne(@Param('matricule', ParseIntPipe) matricule: number) {
    return this.eleveService.findOne(matricule);
  }

  @Put(':matricule')
  @ApiOperation({ summary: 'Modifier un élève' })
  update(@Param('matricule', ParseIntPipe) matricule: number, @Body() dto: UpdateEleveDto) {
    return this.eleveService.update(matricule, dto);
  }

  @Delete(':matricule')
  @ApiOperation({ summary: 'Supprimer un élève' })
  remove(@Param('matricule', ParseIntPipe) matricule: number) {
    return this.eleveService.remove(matricule);
  }
}
