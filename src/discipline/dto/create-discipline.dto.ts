import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  Min,
  Max,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDisciplineDto {
  @ApiProperty({ example: 'Retard en cours' })
  @IsString()
  @IsNotEmpty()
  libelle: string;

  @ApiPropertyOptional({ example: 'Arrivée après le début du cours' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'true = faute, false = comportement positif',
  })
  @IsBoolean()
  @IsOptional()
  estFaute?: boolean;

  @ApiPropertyOptional({
    example: 2,
    description: '1=léger, 2=moyen, 3=grave, 4=très grave',
  })
  @IsInt()
  @Min(1)
  @Max(4)
  @IsOptional()
  gravite?: number;

  @ApiPropertyOptional({ example: 'Retenue' })
  @IsString()
  @IsOptional()
  sanctionType?: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  actif?: boolean;
}
