import { Module } from '@nestjs/common';
import { EmploiDeTempsController } from './emploi-de-temps.controller';
import { EmploiDeTempsService } from './emploi-de-temps.service';

@Module({
  controllers: [EmploiDeTempsController],
  providers: [EmploiDeTempsService]
})
export class EmploiDeTempsModule {}
