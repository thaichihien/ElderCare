import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class AipAssignDto{
    @ApiProperty({ description: 'guardian id to assign' })
    @IsNotEmpty() 
    @IsString()   
    readonly guardianId: string


}