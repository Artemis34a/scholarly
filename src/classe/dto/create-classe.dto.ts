import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateClasseDto {
  @ApiProperty({ example: 'CM1-A' })
  @IsString() @IsNotEmpty() libelle: string;
  @ApiProperty({ example: 1 })
  @IsInt() idCycle: number;
  @ApiProperty({ example: 1 })
  @IsInt() idAdmin: number;
}
