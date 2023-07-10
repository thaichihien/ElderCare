import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateTutorialDto {
  @ApiProperty({ example: 'NestJS Tutorial', description: 'Tutorial title' })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({ example: 'Chi Hien', description: 'Tutorial author' })
  @IsNotEmpty()
  @IsString()
  readonly author: string;

  @ApiProperty({ example: 'Node JS', description: 'Tutorial tag' })
  @IsString()
  readonly tag: string;

  @ApiProperty({ example: 7, description: 'Tutorial view' })
  @IsPositive()
  readonly view: number;
}
