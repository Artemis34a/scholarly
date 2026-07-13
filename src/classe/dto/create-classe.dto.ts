import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateClasseDto {
  @ApiProperty({ example: 'CM1-A' })
  @IsString() @IsNotEmpty() libelle: string;
  @ApiProperty({ example: 1 })
  @IsInt() idCycle: number;
  @ApiPropertyOptional({ example: 1 })
  @IsInt() @IsOptional() idAdmin?: number;
}
