import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateCycleDto {
  @ApiProperty({ example: 'Cycle 1' })
  @IsString() @IsNotEmpty() libelle: string;
  @ApiProperty({ example: 'Premier cycle primaire' })
  @IsString() @IsNotEmpty() description: string;
  @ApiProperty({ example: 1 })
  @IsInt() idAdmin: number;
}
