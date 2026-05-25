import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AnneeAcademiqueService } from './annee-academique.service';
import { CreateAnneeAcademiqueDto } from './dto/create-annee-academique.dto';
import { UpdateAnneeAcademiqueDto } from './dto/update-annee-academique.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Années académiques')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('annees-academiques')
export class AnneeAcademiqueController {
  constructor(private anneeService: AnneeAcademiqueService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une année académique' })
  create(@Body() dto: CreateAnneeAcademiqueDto) { return this.anneeService.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Lister les années académiques' })
  findAll() { return this.anneeService.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une année académique' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.anneeService.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier une année académique' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAnneeAcademiqueDto) {
    return this.anneeService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une année académique' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.anneeService.remove(id); }
}
