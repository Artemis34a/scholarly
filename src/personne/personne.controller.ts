import {
  Controller, Get, Post, Put, Delete,
  Param, Body, UseGuards, ParseIntPipe, Query
} from '@nestjs/common';
import {
  ApiTags, ApiBearerAuth, ApiOperation, ApiQuery
} from '@nestjs/swagger';
import { PersonneService } from './personne.service';
import { CreatePersonneDto } from './dto/create-personne.dto';
import { UpdatePersonneDto } from './dto/update-personne.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Personnes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('personnes')
export class PersonneController {
  constructor(private personneService: PersonneService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une personne' })
  create(@Body() dto: CreatePersonneDto) {
    return this.personneService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister toutes les personnes' })
  @ApiQuery({ name: 'type', required: false, type: Number })
  findAll(@Query('type') type?: number) {
    if (type) return this.personneService.findByType(+type);
    return this.personneService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une personne par ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.personneService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier une personne' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePersonneDto,
  ) {
    return this.personneService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une personne' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.personneService.remove(id);
  }
}
