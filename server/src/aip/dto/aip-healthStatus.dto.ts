import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from "class-validator";

export class AipHealthStatusDto{
    @ApiProperty({ description: 'Health Status' })
    @IsNotEmpty() 
    @IsString()   
    readonly healthStatus: string
}