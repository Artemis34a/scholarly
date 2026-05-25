import { Module } from '@nestjs/common';
import { TitulaireController } from './titulaire.controller';
import { TitulaireService } from './titulaire.service';

@Module({
  controllers: [TitulaireController],
  providers: [TitulaireService],
})
export class TitulaireModule {}
