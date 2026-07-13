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
import { EmploiDeTempsService } from './emploi-de-temps.service';
import { CreateEmploiDeTempsDto } from './dto/create-emploi-de-temps.dto';
import { UpdateEmploiDeTempsDto } from './dto/update-emploi-de-temps.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Emploi du temps')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('emploi-de-temps')
export class EmploiDeTempsController {
  constructor(private emploiService: EmploiDeTempsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un créneau (détecte les conflits classe/salle)' })
  create(@Body() dto: CreateEmploiDeTempsDto) {
    return this.emploiService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lister les créneaux (tableau complet par défaut, paginé si page/limit fournis)',
  })
  @ApiQuery({ name: 'classe', required: false, type: Number })
  @ApiQuery({ name: 'cours', required: false, type: Number })
  @ApiQuery({ name: 'salle', required: false, type: Number })
  @ApiQuery({ name: 'jour', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('classe') classe?: string,
    @Query('cours') cours?: string,
    @Query('salle') salle?: string,
    @Query('jour') jour?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.emploiService.findAll({
      idClasse: classe ? parseInt(classe, 10) : undefined,
      idCours: cours ? parseInt(cours, 10) : undefined,
      idSalle: salle ? parseInt(salle, 10) : undefined,
      jour,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('classes/:idClasse')
  @ApiOperation({ summary: "Emploi du temps complet d'une classe" })
  getGrilleClasse(@Param('idClasse', ParseIntPipe) idClasse: number) {
    return this.emploiService.getGrilleClasse(idClasse);
  }

  @Get('enseignants/:idPers')
  @Roles('admin', 'enseignant')
  @ApiOperation({ summary: "Emploi du temps d'un enseignant (via ses affectations)" })
  getGrilleEnseignant(@Param('idPers', ParseIntPipe) idPers: number) {
    return this.emploiService.getGrilleEnseignant(idPers);
  }

  @Get('eleves/:idEleve')
  @Roles('admin', 'eleve')
  @ApiOperation({ summary: "Emploi du temps d'un élève (via sa classe)" })
  getGrilleEleve(@Param('idEleve', ParseIntPipe) idEleve: number) {
    return this.emploiService.getGrilleEleve(idEleve);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un créneau' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.emploiService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un créneau (revérifie les conflits)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEmploiDeTempsDto) {
    return this.emploiService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un créneau' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.emploiService.remove(id);
  }
}
