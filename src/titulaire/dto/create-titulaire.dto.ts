import { IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateTitulaireDto {
  @ApiProperty({ example: 1, description: 'ID de la personne (enseignant)' })
  @IsInt() idPers: number;
  @ApiProperty({ example: 1, description: 'ID de la salle/classe' })
  @IsInt() idSalle: number;
  @ApiProperty({ example: 1 })
  @IsInt() @Min(0) @Max(1) actif: number;
  @ApiProperty({ example: 1 })
  @IsInt() idAdmin: number;
}
