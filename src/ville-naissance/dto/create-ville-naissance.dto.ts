import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateVilleNaissanceDto {
  @ApiProperty({ example: 'Yaoundé' })
  @IsString() @IsNotEmpty()
  libelle: string;
  @ApiProperty({ example: 1 })
  @IsInt() @Min(0) @Max(1)
  actif: number;
}
