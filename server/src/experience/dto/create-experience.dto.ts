import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExperienceDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly description: string;

  @ApiProperty({
    example: new Date().toISOString(),
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @Transform((value) => value.valueOf(), { toPlainOnly: true })
  readonly startDate: Date;

  @ApiProperty({
    example: new Date().toISOString(),
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @Transform((value) => value.valueOf(), { toPlainOnly: true })
  readonly endDate: Date;
}
