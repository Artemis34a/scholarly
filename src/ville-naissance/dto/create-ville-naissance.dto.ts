import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateVilleNaissanceDto {
  @ApiProperty({ example: 'Yaoundé' })
  @IsString() @IsNotEmpty()
  libelle: string;
  @ApiPropertyOptional({ example: true })
  @IsBoolean() @IsOptional()
  actif?: boolean;
}
