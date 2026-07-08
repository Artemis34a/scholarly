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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Enseignants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('enseignants')
export class EnseignantController {
  constructor(private enseignantService: EnseignantService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un enseignant (compte + affectation à un cours)' })
  create(@Body() dto: CreateEnseignantDto) {
    return this.enseignantService.create(dto);
  }

  @Get()
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
  @ApiOperation({ summary: 'Enseignants actifs' })
  findActifs() {
    return this.enseignantService.findActifs();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un enseignant par identifiant' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.enseignantService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un enseignant' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEnseignantDto) {
    return this.enseignantService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un enseignant' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.enseignantService.remove(id);
  }
}
