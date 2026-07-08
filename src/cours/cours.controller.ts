import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
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
  create(@Body() dto: CreateCoursDto) {
    return this.coursService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister les cours (tableau complet par défaut, paginé si page/limit fournis)',
  })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'classe', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('search') search?: string,
    @Query('classe') classe?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.coursService.findAll({
      search,
      idClasse: classe ? parseInt(classe, 10) : undefined,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('actifs')
  @ApiOperation({ summary: 'Cours actifs uniquement' })
  findActifs() {
    return this.coursService.findActifs();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un cours (classe et enseignants affectés)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coursService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un cours' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCoursDto) {
    return this.coursService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un cours' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coursService.remove(id);
  }
}
