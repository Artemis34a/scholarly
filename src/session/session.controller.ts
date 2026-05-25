import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Sessions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sessions')
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une session' })
  create(@Body() dto: CreateSessionDto) { return this.sessionService.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Lister les sessions' })
  @ApiQuery({ name: 'trimestre', required: false, type: Number })
  @ApiQuery({ name: 'personne', required: false, type: Number })
  findAll(@Query('trimestre') trimestre?: number, @Query('personne') personne?: number) {
    if (trimestre) return this.sessionService.findByTrimestre(+trimestre);
    if (personne) return this.sessionService.findByPersonne(+personne);
    return this.sessionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une session' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.sessionService.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier une session' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSessionDto) {
    return this.sessionService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une session' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.sessionService.remove(id); }
}
