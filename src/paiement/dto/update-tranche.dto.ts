import { PartialType } from '@nestjs/swagger';
import { CreateTrancheDto } from './create-tranche.dto';

export class UpdateTrancheDto extends PartialType(CreateTrancheDto) {}
