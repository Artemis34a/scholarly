import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';
export class CreateTitulaireDto {
  @ApiProperty({ example: 1, description: 'ID de la personne (enseignant)' })
  @IsInt() idPers: number;
  @ApiProperty({ example: 1, description: 'ID de la salle/classe' })
  @IsInt() idSalle: number;
  @ApiPropertyOptional({ example: true })
  @IsBoolean() @IsOptional() actif?: boolean;
  @ApiPropertyOptional({ example: 1 })
  @IsInt() @IsOptional() idAdmin?: number;
}
