import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePaiementDto {
  @ApiProperty({ example: 1, description: 'ID de la scolarité (élève + année académique)' })
  @IsInt()
  idScolarite: number;

  @ApiProperty({ example: 1, description: 'ID de la tranche' })
  @IsInt()
  idTranche: number;

  @ApiProperty({ example: 1, description: 'ID du mode de paiement' })
  @IsInt()
  idModePaiement: number;

  @ApiProperty({ example: 50000, description: 'Montant versé (doit être positif)' })
  @IsNumber()
  @Min(0.01, { message: 'Le montant doit être supérieur à 0.' })
  montant: number;

  @ApiPropertyOptional({ example: '2026-10-05T09:00:00Z' })
  @IsDateString()
  @IsOptional()
  datePaiement?: string;

  @ApiPropertyOptional({ example: 'VIR-2026-00458' })
  @IsString()
  @IsOptional()
  reference?: string;

  @ApiPropertyOptional({ example: 'Paiement au guichet' })
  @IsString()
  @IsOptional()
  commentaire?: string;

  @ApiPropertyOptional({ example: 'RECU-2026-0123' })
  @IsString()
  @IsOptional()
  recuNumero?: string;
}
