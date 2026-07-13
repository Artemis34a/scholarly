import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateAnneeAcademiqueDto {
  @ApiProperty({ example: '2024-2025' })
  @IsString() @IsNotEmpty() libelle: string;
  @ApiProperty({ example: 'Septembre 2024 - Juillet 2025' })
  @IsString() @IsNotEmpty() periode: string;
  @ApiPropertyOptional({ example: 1 })
  @IsInt() @IsOptional() idAdmin?: number;
}
