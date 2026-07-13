import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsInt,
  IsDateString,
  IsEnum,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TypeEpreuve } from '@prisma/client';

export class CreateEpreuveDto {
  @ApiProperty({ example: 'Devoir de Mathématiques' })
  @IsString()
  @IsNotEmpty()
  libelle: string;

  @ApiPropertyOptional({ example: 'Chapitres 1 à 3' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: TypeEpreuve.CONTROLE, enum: TypeEpreuve, description: "Type de l'épreuve" })
  @IsEnum(TypeEpreuve)
  typeEpreuve: TypeEpreuve;

  @ApiProperty({ example: 1, description: "ID de la classe concernée par l'épreuve" })
  @IsInt()
  idClasse: number;

  @ApiPropertyOptional({
    example: 2,
    description:
      "ID du couple cours/classe (ClasseCours) concerné — doit correspondre à idClasse. Obligatoire pour un enseignant (voir EvaluationService.createEpreuve) ; optionnel pour un administrateur.",
  })
  @IsInt()
  @IsOptional()
  idClasseCours?: number;

  @ApiPropertyOptional({
    example: 1,
    description:
      "ID de l'enseignant propriétaire de l'épreuve. Ignoré si l'appelant est lui-même un enseignant (déduit automatiquement de son compte, jamais accepté depuis le corps de la requête pour cette identité) ; utilisable par un administrateur pour assigner l'épreuve à un enseignant précis.",
  })
  @IsInt()
  @IsOptional()
  idEnseignant?: number;

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

  @ApiPropertyOptional({ example: 1, description: "ID de l'administrateur ayant créé l'épreuve" })
  @IsInt()
  @IsOptional()
  idAdmin?: number;
}
