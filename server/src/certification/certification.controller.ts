import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { IsObjectId } from 'src/utils/is-object-id.pipe';
import { CertificationService } from './certification.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { Certification } from './schemas/certification.schema';

@Controller('certification')
export class CertificationController {
  // Cài đặt service
  constructor(private CertificationService: CertificationService) {}

  @Get()
  async getAllCertifications(): Promise<Certification[]> {
    return this.CertificationService.findAll();
  }

  @Post()
  async createCertification(
    @Body()
    Certification: CreateCertificationDto,
  ): Promise<Certification> {
    return this.CertificationService.create(Certification);
  }

  @Get(':id')
  async findCertificationById(
    @Param('id', IsObjectId)
    id: string,
  ): Promise<Certification> {
    return this.CertificationService.findById(id);
  }
}
