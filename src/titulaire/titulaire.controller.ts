import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TitulaireService } from './titulaire.service';
import { CreateTitulaireDto } from './dto/create-titulaire.dto';
import { UpdateTitulaireDto } from './dto/update-titulaire.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Titulaires')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('titulaires')
export class TitulaireController {
  constructor(private titulaireService: TitulaireService) {}

  @Post()
  @ApiOperation({ summary: 'Affecter un titulaire' })
  create(@Body() dto: CreateTitulaireDto) { return this.titulaireService.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Lister les titulaires' })
  findAll() { return this.titulaireService.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un titulaire' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.titulaireService.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un titulaire' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTitulaireDto) {
    return this.titulaireService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un titulaire' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.titulaireService.remove(id); }
}
