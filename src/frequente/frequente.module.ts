import { Module } from '@nestjs/common';
import { FrequenteController } from './frequente.controller';
import { FrequenteService } from './frequente.service';

@Module({
  controllers: [FrequenteController],
  providers: [FrequenteService]
})
export class FrequenteModule {}
