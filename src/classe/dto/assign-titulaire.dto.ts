import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AssignTitulaireDto {
  @ApiProperty({ example: 1, description: 'ID de la personne (enseignant) à affecter comme titulaire' })
  @IsInt()
  idPers: number;
}
