import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateTrancheDto {
  @ApiProperty({ example: 'Tranche 1' })
  @IsString()
  @IsNotEmpty()
  libelle: string;

  @ApiPropertyOptional({ example: 'Premier versement de scolarité' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  @Min(0)
  montant: number;

  @ApiProperty({ example: '2026-10-01' })
  @IsDateString()
  echeance: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  ordre?: number;
}
