import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateCoursDto {
  @ApiProperty({ example: 'Mathématiques' })
  @IsString() @IsNotEmpty() libelle: string;
  @ApiPropertyOptional({ example: 20 })
  @IsNumber() @IsOptional() note?: number;
  @ApiProperty({ example: 2 })
  @IsNumber() coefficient: number;
  @ApiPropertyOptional({
    example: [1, 2],
    description: 'Classes dans lesquelles ce cours est enseigné dès sa création (optionnel).',
  })
  @IsArray() @IsInt({ each: true }) @IsOptional() idClasses?: number[];
  @ApiPropertyOptional({ example: 'Cours de mathematiques niveau CM1' })
  @IsString() @IsOptional() description?: string;
  @ApiPropertyOptional({ example: true })
  @IsBoolean() @IsOptional() actif?: boolean;
  @ApiPropertyOptional({ example: 1 })
  @IsInt() @IsOptional() idAdmin?: number;
}
