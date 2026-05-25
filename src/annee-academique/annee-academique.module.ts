import { Module } from '@nestjs/common';
import { AnneeAcademiqueController } from './annee-academique.controller';
import { AnneeAcademiqueService } from './annee-academique.service';

@Module({
  controllers: [AnneeAcademiqueController],
  providers: [AnneeAcademiqueService],
  exports: [AnneeAcademiqueService],
})
export class AnneeAcademiqueModule {}
