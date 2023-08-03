import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFeedbackDto {
  @ApiProperty({ example: 'tên người đánh giá, phản hồi' })
  @IsString()
  @IsNotEmpty()
  readonly fullname: string;

  @ApiProperty({ example: 'số điện thoại người đánh giá (optional)' })
  @IsString()
  @IsOptional()
  readonly phone: string;

  @ApiProperty({ example: 'email người đánh giá (optional)' })
  @IsString()
  @IsOptional()
  readonly email: string;

  @ApiProperty({
    example: 'mối quan hệ người đánh giá với aip (cha,mẹ,con,anh,chị,...)',
  })
  @IsString()
  @IsNotEmpty()
  readonly relationship: string;

  @ApiProperty({ example: 'guardian id', description: 'guardian id' })
  @IsNotEmpty()
  @IsString()
  guardian: any;

  @ApiProperty({ example: 'aip id', description: 'aip id' })
  @IsNotEmpty()
  @IsString()
  aip: any;

  @ApiProperty({ example: 5, description: 'mức độ hài lòng' })
  @IsNumber()
  @IsNotEmpty()
  readonly satisfactionLevel: number;

  @ApiProperty({ example: 'lời phản hồi, đánh giá' })
  @IsString()
  @IsOptional()
  readonly comment: string;

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'thời gian ca làm việc muốn phản hồi (optional)',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly workTime: Date = null;
}
