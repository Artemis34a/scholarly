import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class AddAffectationDto {
  @ApiProperty({ example: 1, description: 'ID du couple cours/classe (ClasseCours) à affecter' })
  @IsInt() idClasseCours: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt() @IsOptional() idAdmin?: number;
}
