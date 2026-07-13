import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateSessionDto {
  @ApiProperty({ example: 'Session Octobre 2024' })
  @IsString() @IsNotEmpty() libelle: string;
  @ApiPropertyOptional({ example: "Session de cours du mois d'octobre" })
  @IsString() @IsOptional() description?: string;
  @ApiProperty({ example: 1 })
  @IsInt() idTrimestre: number;
  @ApiPropertyOptional({ example: 1 })
  @IsInt() @IsOptional() idAdmin?: number;
}
