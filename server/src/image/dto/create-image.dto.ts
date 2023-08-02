import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateImageDto {

  @ApiProperty({
    example: "http/dsads",
    description: 'time the work should end',
  })
  @IsNotEmpty()
  @IsString()
  readonly link: string;
  readonly latitude: number;
  readonly longitude: number;
  readonly address: string;
  @ApiProperty({
    example: new Date().toISOString(),
    description: 'time photo taken',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  readonly time: Date;


  @IsString()
  @IsOptional()
  readonly task: string;
}
