import { Module } from '@nestjs/common';
import { EleveController } from './eleve.controller';
import { EleveService } from './eleve.service';

@Module({
  controllers: [EleveController],
  providers: [EleveService],
  exports: [EleveService],
})
export class EleveModule {}
