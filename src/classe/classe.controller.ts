import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ClasseService } from './classe.service';
import { CreateClasseDto } from './dto/create-classe.dto';
import { UpdateClasseDto } from './dto/update-classe.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Classes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('classes')
export class ClasseController {
  constructor(private classeService: ClasseService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une classe' })
  create(@Body() dto: CreateClasseDto) { return this.classeService.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Lister les classes (filtre optionnel par cycle)' })
  @ApiQuery({ name: 'cycle', required: false, type: Number })
  findAll(@Query('cycle') cycle?: number) {
    if (cycle) return this.classeService.findByCycle(+cycle);
    return this.classeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une classe' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.classeService.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier une classe' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateClasseDto) {
    return this.classeService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une classe' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.classeService.remove(id); }
}
