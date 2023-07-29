import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCertificationDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  readonly image: string;
}
