import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEvaluationDto {
  @ApiProperty({ example: 1, description: "ID de l'épreuve" })
  @IsNumber()
  @Min(1)
  idEpreuve: number;

  @ApiProperty({ example: 2, description: "ID de l'élève" })
  @IsNumber()
  @Min(1)
  idEleve: number;

  @ApiPropertyOptional({ example: 15.5, description: 'Note obtenue' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  note?: number;

  @ApiPropertyOptional({ example: 'Bon travail, continuez ainsi!' })
  @IsString()
  @IsOptional()
  appreciation?: string;

  @ApiPropertyOptional({ example: 3, description: "Rang de l'élève" })
  @IsInt()
  @Min(1)
  @IsOptional()
  rang?: number;

  @ApiPropertyOptional({ example: 'Élève participatif' })
  @IsString()
  @IsOptional()
  commentaire?: string;
}
