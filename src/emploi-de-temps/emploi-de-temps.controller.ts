import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { EmploiDeTempsService } from './emploi-de-temps.service';
import { CreateEmploiDeTempsDto } from './dto/create-emploi-de-temps.dto';
import { UpdateEmploiDeTempsDto } from './dto/update-emploi-de-temps.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Emploi du temps')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('emploi-de-temps')
export class EmploiDeTempsController {
  constructor(private emploiService: EmploiDeTempsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un créneau' })
  create(@Body() dto: CreateEmploiDeTempsDto) { return this.emploiService.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Lister (filtre optionnel par classe)' })
  @ApiQuery({ name: 'classe', required: false, type: Number })
  findAll(@Query('classe') classe?: number) {
    if (classe) return this.emploiService.findByClasse(+classe);
    return this.emploiService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un créneau' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.emploiService.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un créneau' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEmploiDeTempsDto) {
    return this.emploiService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un créneau' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.emploiService.remove(id); }
}
