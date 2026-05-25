import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { EleveService } from './eleve.service';
import { CreateEleveDto } from './dto/create-eleve.dto';
import { UpdateEleveDto } from './dto/update-eleve.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Élèves')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('eleves')
export class EleveController {
  constructor(private eleveService: EleveService) {}

  @Post()
  @ApiOperation({ summary: 'Inscrire un élève' })
  create(@Body() dto: CreateEleveDto) { return this.eleveService.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Lister les élèves' })
  @ApiQuery({ name: 'search', required: false })
  findAll(@Query('search') search?: string) {
    if (search) return this.eleveService.search(search);
    return this.eleveService.findAll();
  }

  @Get('actifs')
  @ApiOperation({ summary: 'Élèves actifs' })
  findActifs() { return this.eleveService.findActifs(); }

  @Get(':matricule')
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
