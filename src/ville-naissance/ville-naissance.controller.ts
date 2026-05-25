import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { VilleNaissanceService } from './ville-naissance.service';
import { CreateVilleNaissanceDto } from './dto/create-ville-naissance.dto';
import { UpdateVilleNaissanceDto } from './dto/update-ville-naissance.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Villes de naissance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('villes-naissance')
export class VilleNaissanceController {
  constructor(private villeService: VilleNaissanceService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une ville' })
  create(@Body() dto: CreateVilleNaissanceDto) { return this.villeService.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Lister toutes les villes' })
  findAll() { return this.villeService.findAll(); }

  @Get('actives')
  @ApiOperation({ summary: 'Villes actives' })
  findActives() { return this.villeService.findActives(); }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir par ID' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.villeService.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVilleNaissanceDto) {
    return this.villeService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.villeService.remove(id); }
}
