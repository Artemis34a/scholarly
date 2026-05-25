import { IsString, IsNotEmpty, IsOptional, IsDateString, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateEleveDto {
  @ApiProperty({ example: 'Biya' })
  @IsString() @IsNotEmpty() nom: string;

  @ApiProperty({ example: 'Paul Junior' })
  @IsString() @IsNotEmpty() prenom: string;

  @ApiPropertyOptional({ example: '2012-03-15' })
  @IsDateString() @IsOptional() dateNaissance?: string;

  @ApiPropertyOptional({ example: 'Yaoundé' })
  @IsString() @IsOptional() lieuNaissance?: string;

  @ApiProperty({ example: 1, description: '1=M 2=F' })
  @IsInt() @Min(1) @Max(2) sexe: number;

  @ApiProperty({ example: 'Français' })
  @IsString() @IsNotEmpty() langue: string;

  @ApiPropertyOptional({ example: 'https://storage.example.com/photo.jpg' })
  @IsString() @IsOptional() photoURL?: string;

  @ApiProperty({ example: 1 })
  @IsInt() @Min(0) @Max(1) actif: number;

  @ApiProperty({ example: 1 })
  @IsInt() idVilleNaissance: number;

  @ApiProperty({ example: 1 })
  @IsInt() idAdmin: number;
}
