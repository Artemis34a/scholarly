import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateFrequenteDto {
  @ApiProperty({ example: 1, description: 'ID de la salle/classe' })
  @IsInt() idSalle: number;
  @ApiProperty({ example: 1, description: 'ID de l\'année académique' })
  @IsInt() idAcademi: number;
  @ApiProperty({ example: 1001, description: 'Matricule de l\'élève' })
  @IsInt() matricule: number;
  @ApiPropertyOptional({ example: 'Redoublant' })
  @IsString() @IsOptional() commentaire?: string;
  @ApiProperty({ example: 1 })
  @IsInt() idAdmin: number;
}
