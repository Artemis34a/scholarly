import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TrimestreService } from './trimestre.service';
import { CreateTrimestreDto } from './dto/create-trimestre.dto';
import { UpdateTrimestreDto } from './dto/update-trimestre.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Trimestres')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('trimestres')
export class TrimestreController {
  constructor(private triService: TrimestreService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un trimestre' })
  create(@Body() dto: CreateTrimestreDto) { return this.triService.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Lister les trimestres (filtre par année académique)' })
  @ApiQuery({ name: 'annee', required: false, type: Number })
  findAll(@Query('annee') annee?: number) {
    if (annee) return this.triService.findByAnnee(+annee);
    return this.triService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un trimestre' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.triService.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un trimestre' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTrimestreDto) {
    return this.triService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un trimestre' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.triService.remove(id); }
}
