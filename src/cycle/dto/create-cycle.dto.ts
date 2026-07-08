import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateCycleDto {
  @ApiProperty({ example: 'Cycle 1' })
  @IsString() @IsNotEmpty() libelle: string;
  @ApiProperty({ example: 'Premier cycle primaire' })
  @IsString() @IsNotEmpty() description: string;
  @ApiPropertyOptional({ example: 1 })
  @IsInt() @IsOptional() idAdmin?: number;
}
