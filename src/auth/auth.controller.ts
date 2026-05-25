import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RefreshDto } from './dto/login.dto';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login/admin')
  @ApiOperation({ summary: 'Connexion administrateur — renvoie access + refresh + user' })
  loginAdmin(@Body() dto: LoginDto) {
    return this.authService.loginAdmin(dto.email, dto.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Connexion personne — renvoie access + refresh + user' })
  loginPersonne(@Body() dto: LoginDto) {
    return this.authService.loginPersonne(dto.email, dto.password);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Rafraîchir le token — envoie refresh, reçoit access + refresh' })
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refreshTokens(dto.refresh_token);
  }
}
