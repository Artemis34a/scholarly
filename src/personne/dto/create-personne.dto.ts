import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
  Min,
  Max,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePersonneDto {
  @ApiProperty({ example: 'Manga' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ example: 'Jean' })
  @IsString()
  @IsNotEmpty()
  prenom: string;

  @ApiPropertyOptional({ example: '2000-05-15' })
  @IsDateString()
  @IsOptional()
  dateNaissance?: string;

  @ApiPropertyOptional({ example: 'Yaoundé' })
  @IsString()
  @IsOptional()
  lieuNaissance?: string;

  @ApiPropertyOptional({ example: '699000000' })
  @IsString()
  @IsOptional()
  mobile?: string;

  @ApiPropertyOptional({ example: '222000000' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: 1,
    description: '1=élève 2=enseignant 3=parent 4=admin',
  })
  @IsNumber()
  @Min(1)
  @Max(4)
  typePersonne: number;

  @ApiProperty({ example: 'jean.manga' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  username: string;

  @ApiProperty({ example: 'MotDePasse123!' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  password: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  alanyaID?: string;
}
