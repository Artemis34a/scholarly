import { Module } from '@nestjs/common';
import { TrimestreController } from './trimestre.controller';
import { TrimestreService } from './trimestre.service';

@Module({
  controllers: [TrimestreController],
  providers: [TrimestreService]
})
export class TrimestreModule {}
