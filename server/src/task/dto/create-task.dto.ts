import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {
  @ApiProperty({ example: 'Clean the house', description: 'work title' })
  @IsNotEmpty() 
  @IsString() 
  readonly title: string;

  @ApiProperty({ example: 'Clean the first floor', description: 'work title' })
  @IsOptional() 
  @IsString() 
  readonly detail: string;

  @ApiProperty({ example: false, description: 'work detail' })
  @IsOptional() 
  @IsBoolean() 
  readonly isDone: boolean = false;

  @ApiProperty({ example:new Date().toISOString(), description: 'time to start do the work' })
  @IsNotEmpty() 
  @Type(() => Date)
  @IsDate() 
  readonly startTime: Date;

  @ApiProperty({ example: new Date().toISOString(), description: 'time the work should end' })
  @IsNotEmpty() 
  @Type(() => Date)
  @IsDate() 
  readonly endTime: Date;

  @ApiProperty({ example: "", description: 'guardian id' })
  @IsNotEmpty() 
  @IsString() 
  guardian: any;

  @ApiProperty({example: "", description: 'aip id' })
  @IsNotEmpty() 
  @IsString() 
  aip: any;
}
