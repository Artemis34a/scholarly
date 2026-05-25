import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FrequenteService } from './frequente.service';
import { CreateFrequenteDto } from './dto/create-frequente.dto';
import { UpdateFrequenteDto } from './dto/update-frequente.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Fréquentation')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('frequente')
export class FrequenteController {
  constructor(private frequenteService: FrequenteService) {}

  @Post()
  @ApiOperation({ summary: 'Inscrire un élève dans une classe pour une année' })
  create(@Body() dto: CreateFrequenteDto) { return this.frequenteService.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Lister les inscriptions (filtres optionnels)' })
  @ApiQuery({ name: 'classe', required: false, type: Number })
  @ApiQuery({ name: 'eleve', required: false, type: Number })
  @ApiQuery({ name: 'annee', required: false, type: Number })
  findAll(
    @Query('classe') classe?: number,
    @Query('eleve') eleve?: number,
    @Query('annee') annee?: number,
  ) {
    if (classe) return this.frequenteService.findByClasse(+classe);
    if (eleve) return this.frequenteService.findByEleve(+eleve);
    if (annee) return this.frequenteService.findByAnnee(+annee);
    return this.frequenteService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une inscription' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.frequenteService.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier une inscription' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFrequenteDto) {
    return this.frequenteService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une inscription' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.frequenteService.remove(id); }
}
