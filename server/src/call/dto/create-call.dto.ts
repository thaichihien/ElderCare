import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCallDto {
    
  @ApiProperty({ example: 'true', description: 'Successful or Failed' })
  @IsNotEmpty()
  isSuccessful: boolean;

  @ApiProperty({ example: 'DeclinedCall', description: 'Reason must be {DeclinedCall, TimeOut}, null if successful' })
  @IsString()
  @IsOptional()
  reason?: String;
}