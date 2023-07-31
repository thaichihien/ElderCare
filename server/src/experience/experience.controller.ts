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
import { CreateExperienceDto } from './dto/create-experience.dto';
import { ExperienceService } from './experience.service';
import { Experience } from './schemas/experience.schema';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Experience')
@Controller('Experience')
export class ExperienceController {
  // Cài đặt service
  constructor(private ExperienceService: ExperienceService) { }

  @ApiOperation({summary : "Get all experiences"})
  @Get()
  async getAllExperiences(): Promise<Experience[]> {
    return this.ExperienceService.findAll();
  }

  @ApiOperation({summary : "create experience (but haven't added it for guardian yet)"})
  @Post()
  async createExperience(
    @Body()
    Experience: CreateExperienceDto,
  ): Promise<Experience> {
    return this.ExperienceService.create(Experience);
  }

  @ApiOperation({summary : "find experience by experience's id"})
  @Get(':id')
  async findExperienceById(
    @Param('id', IsObjectId)
    id: string,
  ): Promise<Experience> {
    return this.ExperienceService.findById(id);
  }
}
