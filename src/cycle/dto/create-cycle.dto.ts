import { IsString, IsNotEmpty, IsIn, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// L'établissement ne comporte que deux cycles fixes : impossible d'en créer un
// troisième ou d'en renommer un vers une valeur arbitraire.
export const CYCLES_ECOLE = ['Cycle maternel', 'Cycle primaire'] as const;

export class CreateCycleDto {
  @ApiProperty({ example: 'Cycle maternel', enum: CYCLES_ECOLE })
  @IsString() @IsIn(CYCLES_ECOLE) libelle: string;
  @ApiProperty({ example: 'Petite, moyenne et grande section' })
  @IsString() @IsNotEmpty() description: string;
  @ApiPropertyOptional({ example: 1 })
  @IsInt() @IsOptional() idAdmin?: number;
}
