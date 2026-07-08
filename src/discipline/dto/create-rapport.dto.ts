import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDateString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRapportDto {
  @ApiProperty({ example: 1, description: "ID de l'élève" })
  @IsInt()
  @Min(1)
  idEleve: number;

  @ApiProperty({ example: 1, description: 'ID de la discipline' })
  @IsInt()
  @Min(1)
  idDiscipline: number;

  @ApiProperty({
    example: 2,
    description: 'ID de la personne qui fait le rapport',
  })
  @IsInt()
  @Min(1)
  idAuteur: number;

  @ApiPropertyOptional({ example: '2024-05-15T10:00:00Z' })
  @IsDateString()
  @IsOptional()
  dateRapport?: string;

  @ApiProperty({
    example:
      "L'élève est arrivé en retard de 30 minutes au cours de mathématiques.",
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'Jean, Marie' })
  @IsString()
  @IsOptional()
  temoins?: string;

  @ApiPropertyOptional({ example: 'Retenue le mercredi après-midi' })
  @IsString()
  @IsOptional()
  sanctionAppliquee?: string;

  @ApiPropertyOptional({
    example: 'OUVERT',
    description: 'OUVERT, EN_TRAITEMENT, RESOLU, FERME',
  })
  @IsString()
  @IsOptional()
  statut?: string;
}
