import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from "class-validator";

export class AipNoteDto{
    @ApiProperty({ description: 'Note' }) 
    @IsString()   
    readonly note: string
}