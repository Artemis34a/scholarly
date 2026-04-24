import { PartialType } from '@nestjs/swagger';
import { CreatePersonneDto } from './create-personne.dto';

export class UpdatePersonneDto extends PartialType(CreatePersonneDto) {}
