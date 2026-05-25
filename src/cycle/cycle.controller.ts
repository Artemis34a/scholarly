import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CycleService } from './cycle.service';
import { CreateCycleDto } from './dto/create-cycle.dto';
import { UpdateCycleDto } from './dto/update-cycle.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Cycles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cycles')
export class CycleController {
  constructor(private cycleService: CycleService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un cycle' })
  create(@Body() dto: CreateCycleDto) { return this.cycleService.create(dto); }

  @Get()
  @ApiOperation({ summary: 'Lister les cycles' })
  findAll() { return this.cycleService.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un cycle' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.cycleService.findOne(id); }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un cycle' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCycleDto) {
    return this.cycleService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un cycle' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.cycleService.remove(id); }
}
