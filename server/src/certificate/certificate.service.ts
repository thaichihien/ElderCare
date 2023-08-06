import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { Certificate } from './schemas/certificate.schema';
import { ImageService } from 'src/image/image.service';
import { UpdateCertificateDto } from './dto/update-certificate.dto';

@Injectable()
export class CertificateService {
  constructor(
    @InjectModel(Certificate.name)
    private CertificateModel: mongoose.Model<Certificate>,
    private imageService: ImageService,
  ) {}

  async findAll(): Promise<Certificate[]> {
    const Certificates = await this.CertificateModel.find();
    return Certificates;
  }

  async findById(id: string): Promise<Certificate> {
    const Certificate = await this.CertificateModel.findById(id);

    if (!Certificate) {
      throw new NotFoundException(`Certificate not found with id ${id}`);
    }

    return Certificate;
  }

  async create(Certificate: CreateCertificateDto): Promise<Certificate> {
    const created = await this.CertificateModel.create(Certificate);
    return created;
  }

  async update(id: string, cerDto: UpdateCertificateDto): Promise<Certificate> {
    const updated = await this.CertificateModel.findByIdAndUpdate(id, cerDto, {
      new: true,
    });
    return updated;
  }

  async uploadCertificateImage(file: Express.Multer.File, id: string) {
    const imageUrl = await this.imageService.saveImageToCloud(file);

    const updated = await this.CertificateModel.findByIdAndUpdate(
      id,
      {
        image: imageUrl,
      },
      {
        new: true,
      },
    );

    if (!updated) {
      throw new BadRequestException('id not found');
    }

    return updated;
  }
}
