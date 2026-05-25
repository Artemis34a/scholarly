import { PartialType } from '@nestjs/swagger';
import { CreateTrimestreDto } from './create-trimestre.dto';
export class UpdateTrimestreDto extends PartialType(CreateTrimestreDto) {}
