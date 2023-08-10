import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Guardian } from './schemas/guardian.schema';
import mongoose from 'mongoose';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import { Certificate } from '../certificate/schemas/certificate.schema';
import { CreateCertificateDto } from '../certificate/dto/create-certificate.dto';
import { CreateExperienceDto } from 'src/experience/dto/create-experience.dto';
import { ImageService } from 'src/image/image.service';
import { Experience } from '../experience/schemas/experience.schema';

@Injectable()
export class GuardianService {
  constructor(
    @InjectModel(Guardian.name)
    private GuardianModel: mongoose.Model<Guardian>,
    @InjectModel(Certificate.name)
    private certificateModel: mongoose.Model<Certificate>,
    @InjectModel(Experience.name)
    private experienceModel: mongoose.Model<Experience>,
  ) {}

  async findAll(): Promise<Guardian[]> {
    const guardians = await this.GuardianModel.find().populate('certificates').populate('experiences');
    return guardians;
  }

  async findById(id: string): Promise<Guardian> {
    const guardian = await this.GuardianModel.findById(id)
      .populate('certificates')
      .populate('experiences');

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

    if (!created) {
      throw new InternalServerErrorException(created, 'Cannot create guardian');
    }
    return created;
  }

  async update(id: string, guardian: CreateGuardianDto): Promise<Guardian> {
    const updated = await this.GuardianModel.findByIdAndUpdate(id, guardian, {
      new: true,
    })
      .populate('certificates')
      .populate('experiences');

    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.GuardianModel.findByIdAndDelete(id);
  }

  async updateLevel(id: string, level: string): Promise<Guardian> {
    const updated = await this.GuardianModel.findByIdAndUpdate(id, {
      level: level,
    })
      .populate('certificates')
      .populate('experiences');

    return updated;
  }

  async createCertificate(cerDto: CreateCertificateDto, guardianId: string) {
    const certificateDto = {
      title : cerDto.title,
      description :cerDto.description
    }

    const created = await this.certificateModel.create(certificateDto);

    const guardian = await this.GuardianModel.findByIdAndUpdate(guardianId, {
      $push: {
        certificates: created._id,
      },
    });

    if(!guardian){
      await this.certificateModel.findByIdAndDelete(created._id);
      throw new BadRequestException(`Guardian not found with id : ${guardianId}`)
    }


    return created;
  }

  async deleteCertificate(
    guardianId: string,
    certificateId: any,
  ): Promise<Guardian> {
    const guardian = await this.GuardianModel.findById(guardianId);
    const certificateChecck = await this.certificateModel.findById(certificateId)

    if(!guardian){
      throw new BadRequestException(`Guardian not found with id : ${guardianId}`)
    }

    if(!certificateChecck){
      throw new BadRequestException(`Certificate not found with id : ${certificateId}`)
    }

    guardian.certificates = guardian.certificates.filter(
      (c) => c.toString() !== certificateId.toString(),
    );

    

    const updated = await this.GuardianModel.findByIdAndUpdate(guardianId, guardian,{new : true})
      .populate('certificates')
      .populate('experiences');

    await this.certificateModel.findByIdAndDelete(certificateId);

    return updated;
  }

  async createExperience(cerDto: CreateExperienceDto, guardianId: string) {
    const experienceDto = {
      title : cerDto.title,
      description : cerDto.description,
      startDate : new Date(cerDto.startDate),
      endDate : new Date(cerDto.endDate),
    }

    const created = await this.experienceModel.create(experienceDto);

    const guardian =  await this.GuardianModel.findByIdAndUpdate(guardianId, {
      $push: {
        experiences: created._id,
      },
    });

    if(!guardian){
      await this.experienceModel.findByIdAndDelete(created._id);
      throw new BadRequestException(`Guardian not found with id : ${guardianId}`)
    }
    


    return created;
  }

  async deleteExperience(
    guardianId: string,
    experienceId: any,
  ): Promise<Guardian> {
    const guardian = await this.GuardianModel.findById(guardianId);

    guardian.experiences = guardian.experiences.filter(
      (c) => c.toString() !== experienceId.toString(),
    );

    await this.GuardianModel.findByIdAndUpdate(guardianId, guardian)
      .populate('certificates')
      .populate('experiences');

    await this.experienceModel.findByIdAndDelete(experienceId);

    return guardian;
  }
}
