import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class AddClasseDto {
  @ApiProperty({ example: 1, description: 'ID de la classe à associer à ce cours' })
  @IsInt() idClasse: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt() @IsOptional() idAdmin?: number;
}
