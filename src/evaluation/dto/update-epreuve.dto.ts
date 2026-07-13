import { PartialType } from '@nestjs/swagger';
import { CreateEpreuveDto } from './create-epreuve.dto';

export class UpdateEpreuveDto extends PartialType(CreateEpreuveDto) {}
