import { Module } from '@nestjs/common';
import { CoursController } from './cours.controller';
import { CoursService } from './cours.service';

@Module({
  controllers: [CoursController],
  providers: [CoursService],
  exports: [CoursService],
})
export class CoursModule {}
