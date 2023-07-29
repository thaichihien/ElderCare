import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { Certification } from './schemas/certification.schema';

@Injectable()
export class CertificationService {
  // Cài model để tương tác với MongoDB
  constructor(
    @InjectModel(Certification.name)
    private CertificationModel: mongoose.Model<Certification>,
  ) {}

  async findAll(): Promise<Certification[]> {
    const Certifications = await this.CertificationModel.find();
    return Certifications;
  }

  async findById(id: string): Promise<Certification> {
    const Certification = await this.CertificationModel.findById(id);

    if (!Certification) {
      throw new NotFoundException(`Certification not found with id ${id}`);
    }

    return Certification;
  }

  async create(Certification: CreateCertificationDto): Promise<Certification> {
    const created = await this.CertificationModel.create(Certification);
    return created;
  }
}
