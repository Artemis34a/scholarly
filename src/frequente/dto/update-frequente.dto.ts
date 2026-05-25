import { PartialType } from '@nestjs/swagger';
import { CreateFrequenteDto } from './create-frequente.dto';
export class UpdateFrequenteDto extends PartialType(CreateFrequenteDto) {}
