import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Guardian } from './schemas/guardian.schema';
import mongoose from 'mongoose';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import { Certification } from './schemas/certification.schema';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { ImageService } from 'src/image/image.service';

@Injectable()
export class GuardianService {
  constructor(
    @InjectModel(Guardian.name)
    private GuardianModel: mongoose.Model<Guardian>,
    @InjectModel(Certification.name)
    private certificationModel: mongoose.Model<Certification>,
    private imageSerive: ImageService,
  ) {}

  async findAll(): Promise<Guardian[]> {
    const guardians = await this.GuardianModel.find().populate('certifications');
    return guardians;
  }

  async findById(id: string): Promise<Guardian> {
    const guardian = await this.GuardianModel.findById(id);

    if (!guardian) {
      throw new NotFoundException(`Guardian not found with id ${id}`);
    }

    return guardian;
  }

  async findByCCCD(CCCD: string): Promise<Guardian> {
    const guardian = await this.GuardianModel.find().where('CCCD').equals(CCCD);

    if (guardian.length <= 0) {
      throw new NotFoundException('Guardian not found');
    }

    return guardian[0];
  }

  async create(guardian: CreateGuardianDto): Promise<Guardian> {
    const created = await this.GuardianModel.create(guardian);
    return created;
  }

  async update(id: string, guardian: CreateGuardianDto): Promise<Guardian> {
    const updated = await this.GuardianModel.findByIdAndUpdate(id, guardian, {
      new: true,
    });

    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.GuardianModel.findByIdAndDelete(id);
  }

  async updateLevel(id: string, level: string): Promise<Guardian> {
    const updated = await this.GuardianModel.findByIdAndUpdate(id, {
      level: level,
    });

    return updated;
  }

  async createCertification(
    cerDto: CreateCertificationDto,
    guardianId: string,
  ) {
    const created = await this.certificationModel.create(cerDto);

    await this.GuardianModel.findByIdAndUpdate(guardianId, {
      $push: {
        certifications: created._id,
      },
    });

    return created;
  }

  async uploadCertificationImage(file: Express.Multer.File, id: string) {
    const imageUrl = await this.imageSerive.saveImageToCloud(file);

    const updated = await this.certificationModel.findByIdAndUpdate(
      id,
      {
        image: imageUrl,
      },
      {
        new: true,
      },
    );

    if(!updated){
      throw new BadRequestException('id not found')
    }

    return updated;
  }
}
