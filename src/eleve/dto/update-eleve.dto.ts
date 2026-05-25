import { PartialType } from '@nestjs/swagger';
import { CreateEleveDto } from './create-eleve.dto';
export class UpdateEleveDto extends PartialType(CreateEleveDto) {}
