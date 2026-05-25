import { Module } from '@nestjs/common';
import { ClasseController } from './classe.controller';
import { ClasseService } from './classe.service';

@Module({
  controllers: [ClasseController],
  providers: [ClasseService],
  exports: [ClasseService],
})
export class ClasseModule {}
