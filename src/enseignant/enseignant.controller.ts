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
import { EnseignantService } from './enseignant.service';
import { CreateEnseignantDto } from './dto/create-enseignant.dto';
import { UpdateEnseignantDto } from './dto/update-enseignant.dto';
import { AddAffectationDto } from './dto/add-affectation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Enseignants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('enseignants')
export class EnseignantController {
  constructor(private enseignantService: EnseignantService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un enseignant (compte + une affectation cours/classe initiale)' })
  create(@Body() dto: CreateEnseignantDto) {
    return this.enseignantService.create(dto);
  }

  @Get()
  @Roles('admin', 'enseignant')
  @ApiOperation({ summary: 'Lister les enseignants (paginé, recherche optionnelle)' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.enseignantService.findAll({
      search,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('actifs')
  @Roles('admin', 'enseignant')
  @ApiOperation({ summary: 'Enseignants actifs' })
  findActifs() {
    return this.enseignantService.findActifs();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un enseignant par identifiant (avec ses affectations)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.enseignantService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un enseignant (informations personnelles, statut)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEnseignantDto) {
    return this.enseignantService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un enseignant (révoque aussi son compte et son titulariat éventuel)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.enseignantService.remove(id);
  }

  @Post(':id/affectations')
  @ApiOperation({ summary: "Ajouter une affectation d'enseignement (cours dans une classe)" })
  addAffectation(@Param('id', ParseIntPipe) id: number, @Body() dto: AddAffectationDto) {
    return this.enseignantService.addAffectation(id, dto.idClasseCours, dto.idAdmin);
  }

  @Delete(':id/affectations/:idAffectation')
  @ApiOperation({ summary: "Retirer une affectation d'enseignement" })
  removeAffectation(
    @Param('id', ParseIntPipe) id: number,
    @Param('idAffectation', ParseIntPipe) idAffectation: number,
  ) {
    return this.enseignantService.removeAffectation(id, idAffectation);
  }
}
