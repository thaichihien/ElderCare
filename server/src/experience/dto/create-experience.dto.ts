import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateExperienceDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @Transform((value) => value.valueOf(), { toPlainOnly: true })
  readonly startDate: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @Transform((value) => value.valueOf(), { toPlainOnly: true })
  readonly endDate: Date;
}
