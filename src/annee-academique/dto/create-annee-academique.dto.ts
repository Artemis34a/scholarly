import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateAnneeAcademiqueDto {
  @ApiProperty({ example: '2024-2025' })
  @IsString() @IsNotEmpty() libelle: string;
  @ApiProperty({ example: 'Septembre 2024 - Juillet 2025' })
  @IsString() @IsNotEmpty() periode: string;
  @ApiProperty({ example: 1 })
  @IsInt() idAdmin: number;
}
