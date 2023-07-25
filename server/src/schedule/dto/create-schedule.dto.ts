import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty({
    example: new Date().toISOString(),
    description: 'free start time of guardian',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  readonly startTime: Date;

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'free end time of guardian',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  readonly endTime: Date;

  @ApiProperty({
    example: false,
    description:
      'if it is true, server only check the time (meaning they are free at this time every week) else server will check the time and date',
  })
  @IsOptional()
  @IsBoolean()
  readonly isCycle: boolean;

  @ApiProperty({ example: "guardian id", description: 'guardian id' })
  @IsNotEmpty() 
  @IsString() 
  guardian: any;
}
