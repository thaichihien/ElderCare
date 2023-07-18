import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';


// Lớp này giúp đảm bảo kiểm tra đầu vào trước khi insert vào db
// - ApiProperty: chỉ dùng cho mục dích miêu tả rỏ rảng trong api document (swagger), không bắt buộc nhưng có để team dễ dàng hiểu api cần gì
// các decorator khác từ class validator dùng để kiểm tra đầu vào, nếu thất bại tự trả về BadRequest (400) cho client mà mình không cần viết hàm kiểm tra
export class CreateGuardianDto {
    @ApiProperty({ example: 'Nguyen', description: 'First name' })
    @IsNotEmpty() // thuộc tính bắt buộc phải có khi muốn tạo dữ liệu vào db
    @IsString()   // thuộc tính này phải là dạng String
    readonly firstName: string;

    @ApiProperty({ example: 'Phu', description: 'Last name' })
    @IsNotEmpty() 
    @IsString()   
    readonly lastName: string;

    @ApiProperty({ example: '08652...', description: 'CCCD' })
    @IsNotEmpty() 
    @IsString() 
    readonly CCCD: string;

    @ApiProperty({ example: '0787888787', description: 'Phone Number' })
    @IsNotEmpty() 
    @IsString() 
    readonly phoneNumber: string;

    @ApiProperty({ example: '12/06/2002', description: 'Date of birth' })
    @IsNotEmpty() 
    @IsString() 
    readonly dateOfBirth: string;

    @ApiProperty({ example: '135B Tran Hung Dao', description: 'Address' })
    @IsNotEmpty() 
    @IsString() 
    readonly address: string;
}
