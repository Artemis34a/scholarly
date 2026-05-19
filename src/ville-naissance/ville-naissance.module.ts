import { Module } from '@nestjs/common';
import { VilleNaissanceController } from './ville-naissance.controller';
import { VilleNaissanceService } from './ville-naissance.service';

@Module({
  controllers: [VilleNaissanceController],
  providers: [VilleNaissanceService]
})
export class VilleNaissanceModule {}
