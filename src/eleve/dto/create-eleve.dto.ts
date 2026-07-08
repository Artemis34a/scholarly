import { IsString, IsNotEmpty, IsOptional, IsDateString, IsInt, Min, Max, IsBoolean, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateEleveDto {
  @ApiProperty({ example: 'Njoya' })
  @IsString() @IsNotEmpty() nom: string;

  @ApiProperty({ example: 'Paul Junior' })
  @IsString() @IsNotEmpty() prenom: string;

  @ApiProperty({ example: '2012-03-15' })
  @IsDateString() dateNaissance: string;

  @ApiProperty({ example: 'Yaounde' })
  @IsString() @IsNotEmpty() lieuNaissance: string;

  @ApiProperty({ example: 1, description: '1=M 2=F' })
  @IsInt() @Min(1) @Max(2) sexe: number;

  @ApiProperty({ example: 'Français' })
  @IsString() @IsNotEmpty() langue: string;

  @ApiPropertyOptional({ example: 'https://storage.example.com/photo.jpg' })
  @IsString() @IsOptional() photoURL?: string;

  @ApiProperty({ example: 'paul.njoya' })
  @IsString() @IsNotEmpty() @Length(3, 100) username: string;

  @ApiProperty({ example: 'eleve123' })
  @IsString() @IsNotEmpty() @Length(4, 100) password: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean() @IsOptional() actif?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsInt() @IsOptional() idVilleNaissance?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsInt() @IsOptional() idAdmin?: number;
}
