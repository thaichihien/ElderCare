import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { IsObjectId } from 'src/utils/is-object-id.pipe';
import { CertificateService } from './certificate.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { Certificate } from './schemas/certificate.schema';
import { ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('certificate')
export class CertificateController {
  // Cài đặt service
  constructor(private certificateService: CertificateService) {}

  @Get()
  async getAllCertificates(): Promise<Certificate[]> {
    return this.certificateService.findAll();
  }

  @Post()
  async createCertificate(
    @Body()
    Certificate: CreateCertificateDto,
  ): Promise<Certificate> {
    return this.certificateService.create(Certificate);
  }

  @Get(':id')
  async findCertificateById(
    @Param('id', IsObjectId)
    id: string,
  ): Promise<Certificate> {
    return this.certificateService.findById(id);
  }

  @ApiOperation({ summary: 'Upload certificate image' })
  @Post('certificate/:id/image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCertificateImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return this.certificateService.uploadCertificateImage(file, id);
  }
}
