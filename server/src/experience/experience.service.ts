import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { Experience } from './schemas/experience.schema';

@Injectable()
export class ExperienceService {
  // Cài model để tương tác với MongoDB
  constructor(
    @InjectModel(Experience.name)
    private ExperienceModel: mongoose.Model<Experience>,
  ) { }

  async findAll(): Promise<Experience[]> {
    const Experiences = await this.ExperienceModel.find();
    return Experiences;
  }

  async findById(id: string): Promise<Experience> {
    const Experience = await this.ExperienceModel.findById(id);

    if (!Experience) {
      throw new NotFoundException(`Experience not found with id ${id}`);
    }

    return Experience;
  }

  async create(Experience: CreateExperienceDto): Promise<Experience> {
    const created = await this.ExperienceModel.create(Experience);
    return created;
  }
}
