import { PartialType } from '@nestjs/swagger';
import { CreateVilleNaissanceDto } from './create-ville-naissance.dto';
export class UpdateVilleNaissanceDto extends PartialType(CreateVilleNaissanceDto) {}
