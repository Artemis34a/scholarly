import { IsIn, IsInt, IsOptional, IsBoolean, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const JOURS_SEMAINE = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'] as const;
const HEURE_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class CreateEmploiDeTempsDto {
  @ApiProperty({ example: 'LUNDI', enum: JOURS_SEMAINE })
  @IsIn(JOURS_SEMAINE)
  jour: string;

  @ApiProperty({ example: '08:00', description: 'Heure de début (HH:mm)' })
  @Matches(HEURE_REGEX, { message: 'Les horaires saisis sont invalides (format attendu HH:mm).' })
  heureDebut: string;

  @ApiProperty({ example: '09:00', description: 'Heure de fin (HH:mm)' })
  @Matches(HEURE_REGEX, { message: 'Les horaires saisis sont invalides (format attendu HH:mm).' })
  heureFin: string;

  @ApiProperty({ example: 1, description: 'Classe concernée' })
  @IsInt()
  idClasse: number;

  @ApiProperty({ example: 1, description: 'Cours enseigné sur ce créneau' })
  @IsInt()
  idCours: number;

  @ApiProperty({ example: 1, description: 'Enseignant en charge de ce créneau' })
  @IsInt()
  idEnseignant: number;

  @ApiPropertyOptional({ example: 1, description: 'Salle occupée (optionnelle)' })
  @IsInt()
  @IsOptional()
  idSalle?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  actif?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  idAdmin?: number;
}
