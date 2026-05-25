import { PartialType } from '@nestjs/swagger';
import { CreateTitulaireDto } from './create-titulaire.dto';
export class UpdateTitulaireDto extends PartialType(CreateTitulaireDto) {}
