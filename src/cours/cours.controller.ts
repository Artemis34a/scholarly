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
import { AddClasseDto } from './dto/add-classe.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Cours')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('cours')
export class CoursController {
  constructor(private coursService: CoursService) {}

  @Post()
  @ApiOperation({ summary: "Créer un cours (optionnellement associé à des classes dès la création)" })
  create(@Body() dto: CreateCoursDto) {
    return this.coursService.create(dto);
  }

  @Get()
  @Roles('admin', 'enseignant')
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
  @Roles('admin', 'enseignant')
  @ApiOperation({ summary: 'Cours actifs uniquement' })
  findActifs() {
    return this.coursService.findActifs();
  }

  @Get(':id')
  @Roles('admin', 'enseignant')
  @ApiOperation({ summary: 'Obtenir un cours (classes et enseignants affectés)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coursService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un cours (libellé, coefficient...)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCoursDto) {
    return this.coursService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un cours' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coursService.remove(id);
  }

  @Post(':id/classes')
  @ApiOperation({ summary: 'Associer ce cours à une classe supplémentaire' })
  addClasse(@Param('id', ParseIntPipe) id: number, @Body() dto: AddClasseDto) {
    return this.coursService.addClasse(id, dto.idClasse, dto.idAdmin);
  }

  @Delete(':id/classes/:idClasse')
  @ApiOperation({ summary: 'Retirer ce cours d\'une classe' })
  removeClasse(
    @Param('id', ParseIntPipe) id: number,
    @Param('idClasse', ParseIntPipe) idClasse: number,
  ) {
    return this.coursService.removeClasse(id, idClasse);
  }
}
