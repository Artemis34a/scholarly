import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateEmploiDeTempsDto {
  @ApiProperty({ example: 'Lundi', description: 'Jour de la semaine' })
  @IsString() @IsNotEmpty() jour: string;
  @ApiProperty({ example: '08:00', description: 'Heure de début (HH:mm)' })
  @IsString() @IsNotEmpty() heure: string;
  @ApiProperty({ example: 1 })
  @IsInt() idClasse: number;
  @ApiProperty({ example: 1 })
  @IsInt() idCours: number;
  @ApiProperty({ example: 1 })
  @IsInt() idAdmin: number;
}
