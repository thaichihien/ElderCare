import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateExperienceDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsNotEmpty()
  @IsDate()
  readonly startDate: Date;

  @IsNotEmpty()
  @IsDate()
  readonly endDate: Date;
}
