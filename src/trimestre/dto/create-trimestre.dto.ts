import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateTrimestreDto {
  @ApiProperty({ example: 'Trimestre 1' })
  @IsString() @IsNotEmpty() libelle: string;
  @ApiProperty({ example: 'Septembre - Décembre 2024' })
  @IsString() @IsNotEmpty() periode: string;
  @ApiProperty({ example: 1 })
  @IsInt() idAca: number;
  @ApiPropertyOptional({ example: 1 })
  @IsInt() @IsOptional() idAdmin?: number;
}
