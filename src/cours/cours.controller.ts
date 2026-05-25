import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CoursService } from './cours.service';
import { CreateCoursDto } from './dto/create-cours.dto';
import { UpdateCoursDto } from './dto/update-cours.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Cours')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cours')
export class CoursController {
  constructor(private coursService: CoursService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un cours' })
  create(@Body() dto: CreateCoursDto) { return this.coursService.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Lister tous les cours' })
  findAll() { return this.coursService.findAll(); }

  @Get('actifs')
  @ApiOperation({ summary: 'Cours actifs uniquement' })
  findActifs() { return this.coursService.findActifs(); }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un cours' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.coursService.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un cours' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCoursDto) {
    return this.coursService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un cours' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.coursService.remove(id); }
}
