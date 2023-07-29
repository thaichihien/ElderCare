import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UploadImageDto {
  @ApiProperty({
    example: 'http/dsads',
    description: 'time the work should end',
  })
  @IsNotEmpty()
  @IsString()
  readonly link: string;

  

}
