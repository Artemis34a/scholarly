import { PartialType } from '@nestjs/swagger';
import { CreateAnneeAcademiqueDto } from './create-annee-academique.dto';
export class UpdateAnneeAcademiqueDto extends PartialType(CreateAnneeAcademiqueDto) {}
