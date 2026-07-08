import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsInt,
  IsBoolean,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEnseignantDto {
  @ApiProperty({ example: 'Tchoumi' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ example: 'Sophie' })
  @IsString()
  @IsNotEmpty()
  prenom: string;

  @ApiProperty({ example: 'sophie.tchoumi' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  username: string;

  @ApiProperty({ example: 'MotDePasse123!' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  password: string;

  @ApiPropertyOptional({ example: '699000000' })
  @IsString()
  @IsOptional()
  mobile?: string;

  @ApiPropertyOptional({ example: '222000000' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: '1985-04-12' })
  @IsDateString()
  @IsOptional()
  dateNaissance?: string;

  @ApiPropertyOptional({ example: 'Yaounde' })
  @IsString()
  @IsOptional()
  lieuNaissance?: string;

  @ApiProperty({ example: 1, description: 'Identifiant du cours enseigné' })
  @IsInt()
  idCours: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  actif?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  idAdmin?: number;
}
