import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  // Route publique pour créer le premier admin (à sécuriser ensuite)
  @Post('setup')
  @ApiOperation({ summary: 'Créer un admin (setup initial)' })
  create(@Body() dto: CreateAdminDto) {
    return this.adminService.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Lister tous les admins' })
  findAll() {
    return this.adminService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un admin' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.remove(id);
  }
}
