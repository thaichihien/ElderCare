import { ApiProperty } from "@nestjs/swagger";

export class CreateTutorialDto {
  @ApiProperty({ example: "NestJS Tutorial", description: 'Tutorial title' })
  readonly title: string;
  @ApiProperty({ example: "Chi Hien", description: 'Tutorial author' })
  readonly author: string;
  @ApiProperty({ example: "Node JS", description: 'Tutorial tag' })
  readonly tag: string;
  @ApiProperty({ example: 7, description: 'Tutorial view' })
  readonly view: number;
}
