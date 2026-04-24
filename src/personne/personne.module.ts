import { Module } from '@nestjs/common';
import { PersonneService } from './personne.service';
import { PersonneController } from './personne.controller';

@Module({
  providers: [PersonneService],
  controllers: [PersonneController],
  exports: [PersonneService],
})
export class PersonneModule {}
