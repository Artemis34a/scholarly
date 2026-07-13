import { IsString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateFrequenteDto {
  @ApiProperty({ example: 1, description: 'ID de la salle/classe' })
  @IsInt() idSalle: number;
  @ApiProperty({ example: 1, description: "ID de l'eleve" })
  @IsInt() idEleve: number;
  @ApiPropertyOptional({ example: 'Redoublant' })
  @IsString() @IsOptional() commentaire?: string;
  @ApiPropertyOptional({ example: 1 })
  @IsInt() @IsOptional() idAdmin?: number;
}
