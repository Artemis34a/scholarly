import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login/admin')
  @ApiOperation({ summary: 'Connexion administrateur' })
  loginAdmin(@Body() dto: LoginDto) {
    return this.authService.loginAdmin(dto.username, dto.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Connexion personne (enseignant, directeur, parent)' })
  loginPersonne(@Body() dto: LoginDto) {
    return this.authService.loginPersonne(dto.username, dto.password);
  }

  @Post('login/eleve')
  @ApiOperation({ summary: 'Connexion élève' })
  loginEleve(@Body() dto: LoginDto) {
    return this.authService.loginEleve(dto.username, dto.password);
  }
}
