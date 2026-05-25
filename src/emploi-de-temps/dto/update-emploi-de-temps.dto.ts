import { PartialType } from '@nestjs/swagger';
import { CreateEmploiDeTempsDto } from './create-emploi-de-temps.dto';
export class UpdateEmploiDeTempsDto extends PartialType(CreateEmploiDeTempsDto) {}
