import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateTrimestreDto {
  @ApiProperty({ example: 'Trimestre 1' })
  @IsString() @IsNotEmpty() libelle: string;
  @ApiProperty({ example: 'Septembre - Décembre 2024' })
  @IsString() @IsNotEmpty() periode: string;
  @ApiProperty({ example: 1 })
  @IsInt() idAca: number;
  @ApiProperty({ example: 1 })
  @IsInt() idAdmin: number;
}
