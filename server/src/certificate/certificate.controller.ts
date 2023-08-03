import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { IsObjectId } from 'src/utils/is-object-id.pipe';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { Certificate } from './schemas/certificate.schema';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateCetificateDto } from './dto/update-certificate.dto';

@ApiTags('Certificate')
@Controller('certificate')
export class CertificateController {
  // Cài đặt service
  constructor(private certificateService: CertificateService) {}

  @ApiOperation({summary : "Get all certifications of all guardian"})
  @Get()
  async getAllCertificates(): Promise<Certificate[]> {
    return this.certificateService.findAll();
  }

  @ApiOperation({summary : "Create a certification (but haven't added it for guardian yet)"})
  @Post()
  async createCertificate(
    @Body()
    Certificate: CreateCertificateDto,
  ): Promise<Certificate> {
    return this.certificateService.create(Certificate);
  }

  @ApiOperation({summary : "update a certification"})
  @Put(':id')
  async updateCertificate(
    @Param('id', IsObjectId)
    id:string,
    @Body()
    cerDto: UpdateCetificateDto,
  ): Promise<Certificate> {
    return this.certificateService.update(id,cerDto);
  }




  @ApiOperation({summary : "Find a certification by certification's id"})
  @Get(':id')
  async findCertificateById(
    @Param('id', IsObjectId)
    id: string,
  ): Promise<Certificate> {
    return this.certificateService.findById(id);
  }

  @ApiOperation({ summary: 'Upload certificate image to certificate with id' })
  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCertificateImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return this.certificateService.uploadCertificateImage(file, id);
  }
}
