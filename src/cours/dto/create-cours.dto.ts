import { IsString, IsNotEmpty, IsNumber, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateCoursDto {
  @ApiProperty({ example: 'Mathématiques' })
  @IsString() @IsNotEmpty() libelle: string;
  @ApiProperty({ example: 20 })
  @IsNumber() note: number;
  @ApiProperty({ example: 2 })
  @IsNumber() coefficient: number;
  @ApiProperty({ example: 'Cours de mathématiques niveau CM1' })
  @IsString() @IsNotEmpty() description: string;
  @ApiProperty({ example: 1 })
  @IsInt() idLivre: number;
  @ApiProperty({ example: 1, description: '1=actif 0=inactif' })
  @IsInt() @Min(0) @Max(1) actif: number;
  @ApiProperty({ example: 1 })
  @IsInt() idAdmin: number;
}
