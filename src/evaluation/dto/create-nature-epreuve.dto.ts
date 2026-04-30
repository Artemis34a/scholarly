import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNatureEpreuveDto {
  @ApiProperty({ example: 'Composition Trimestrielle' })
  @IsString()
  @IsNotEmpty()
  libelle: string;

  @ApiPropertyOptional({ example: 'Évaluation de fin de trimestre' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 1.0 })
  @IsNumber()
  @Min(0)
  coefficient?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  actif?: boolean;
}
