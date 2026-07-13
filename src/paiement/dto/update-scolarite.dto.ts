import { PartialType } from '@nestjs/swagger';
import { CreateScolariteDto } from './create-scolarite.dto';

export class UpdateScolariteDto extends PartialType(CreateScolariteDto) {}
