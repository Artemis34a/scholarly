import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsIn, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export const STATUTS_SCOLARITE = ['ACTIF', 'TRANSFERE', 'EXCLU', 'ABANDON'] as const;

export class CreateScolariteDto {
  @ApiProperty({ example: 1, description: "ID de l'élève" })
  @IsInt()
  idEleve: number;

  @ApiProperty({ example: 1, description: "ID de l'année académique" })
  @IsInt()
  idAnneeAcademique: number;

  @ApiProperty({ example: 1, description: 'ID de la classe' })
  @IsInt()
  idClasse: number;

  @ApiPropertyOptional({ example: 'ACTIF', enum: STATUTS_SCOLARITE })
  @IsIn(STATUTS_SCOLARITE)
  @IsOptional()
  statut?: string;

  @ApiPropertyOptional({ example: '2026-09-01' })
  @IsDateString()
  @IsOptional()
  dateInscription?: string;

  @ApiPropertyOptional({ example: 50000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  fraisInscription?: number;

  @ApiPropertyOptional({ example: 300000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  fraisScolarite?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  reduction?: number;

  @ApiPropertyOptional({ example: 'Bourse partielle' })
  @IsString()
  @IsOptional()
  observations?: string;
}
