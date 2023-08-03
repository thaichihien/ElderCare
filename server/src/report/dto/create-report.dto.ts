import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';
import { Aip } from 'src/aip/schemas/aip.schema';

export class CreateReportDto {

    // @ApiProperty({ example: '123...', description: 'Aip Id' })
    // @IsNotEmpty() // thuộc tính bắt buộc phải có khi muốn tạo dữ liệu vào db
    // @IsString()   // thuộc tính này phải là dạng String
    // readonly aip: Aip;

    @ApiProperty({ example: '03/08/2023', description: 'Date' })
    @IsNotEmpty()
    @IsString()
    readonly date: string;

    @ApiProperty({ example: '...', description: 'summarization' })
    @IsString()
    readonly summarization: string;

    @ApiProperty({ example: 'khoe', description: 'Health Status Of Aip' })
    @IsNotEmpty()
    @IsString()
    readonly healthStatusOfAip: string;

    @ApiProperty({ example: 'Can them ho tro', description: 'Support Request' })
    @IsString()
    readonly supportRequest: string;

    @ApiProperty({ example: 'Cần chăm sóc thường xuyên', description: 'Note' })
    @IsString()
    readonly note: string;
}
