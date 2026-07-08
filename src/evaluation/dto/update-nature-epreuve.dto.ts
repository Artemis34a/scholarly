import { PartialType } from '@nestjs/swagger';
import { CreateNatureEpreuveDto } from './create-nature-epreuve.dto';

export class UpdateNatureEpreuveDto extends PartialType(CreateNatureEpreuveDto) {}
