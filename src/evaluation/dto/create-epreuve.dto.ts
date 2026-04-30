import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEpreuveDto {
  @ApiProperty({ example: 'Devoir de Mathématiques' })
  @IsString()
  @IsNotEmpty()
  libelle: string;

  @ApiPropertyOptional({ example: 'Chapitres 1 à 3' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1, description: "ID de la nature de l'épreuve" })
  @IsNumber()
  @Min(1)
  idNatureEpreuve: number;

  @ApiPropertyOptional({ example: 2, description: 'ID du cours (optionnel)' })
  @IsNumber()
  @Min(1)
  @IsOptional()
  idCours?: number;

  @ApiProperty({ example: '2024-05-15T08:00:00Z' })
  @IsDateString()
  dateEpreuve: string;

  @ApiPropertyOptional({ example: 120, description: 'Durée en minutes' })
  @IsNumber()
  @Min(1)
  @IsOptional()
  duree?: number;

  @ApiPropertyOptional({ example: 2.0 })
  @IsNumber()
  @Min(0)
  coefficient?: number;

  @ApiPropertyOptional({ example: 20.0 })
  @IsNumber()
  @Min(0)
  noteMax?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  actif?: boolean;
}
