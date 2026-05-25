import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateSessionDto {
  @ApiProperty({ example: 'Session Octobre 2024' })
  @IsString() @IsNotEmpty() libelle: string;
  @ApiProperty({ example: 'Session de cours du mois d\'octobre' })
  @IsString() @IsNotEmpty() description: string;
  @ApiProperty({ example: 1 })
  @IsInt() idTrimestre: number;
  @ApiProperty({ example: 1 })
  @IsInt() idPers: number;
}
