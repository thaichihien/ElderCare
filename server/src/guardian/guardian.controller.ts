import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { IsObjectId } from 'src/utils/is-object-id.pipe';
import { isStringObject } from 'util/types';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import { GuardianService } from './guardian.service';
import { Guardian } from './schemas/guardian.schema';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateCertificateDto } from '../certificate/dto/create-certificate.dto';
import { CreateExperienceDto } from 'src/experience/dto/create-experience.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Guardian')
@Controller('guardian')
export class GuardianController {
  constructor(private guardianService: GuardianService) {}

  @ApiOperation({ summary: 'Create a new guardian' })
  @Post()
  async createGuardian(
    @Body()
    guardian: CreateGuardianDto,
  ): Promise<Guardian> {
    return this.guardianService.create(guardian);
  }

  @ApiOperation({ summary: 'Find a guardian with id' })
  @Get(':id')
  async findGuardianById(
    @Param('id', IsObjectId)
    id: string,
  ): Promise<Guardian> {
    return this.guardianService.findById(id);
  }

  @ApiOperation({ summary: 'Get all guardians' })
  @Get()
  async findAll(): Promise<Guardian[]> {
    return this.guardianService.findAll();
  }

  @Get('/CCCD/:CCCD')
  async findByCCCD(
    @Param('CCCD')
    CCCD: string,
  ): Promise<Guardian> {
    return this.guardianService.findByCCCD(CCCD);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() guardian: CreateGuardianDto,
  ): Promise<Guardian> {
    return this.guardianService.update(id, guardian);
  }

  @Delete(':id')
  async delete(
    @Param('id')
    id: string,
  ): Promise<void> {
    return this.guardianService.delete(id);
  }

  @ApiQuery({
    name: 'level',
    required: true,
    example: 'Professional',
    description:
      "Change level of guardian (only Amateur or Professional)",
  })
  @ApiOperation({ summary: 'update level (Amateur or Professional) to guardian with id' })
  @Patch(':id?')
  async updateLevel(
    @Param('id') id: string,
    @Query('level') level: string,
  ): Promise<Guardian> {
    return this.guardianService.updateLevel(id, level);
  }

  @ApiOperation({ summary: 'Create a certification and add it to guardian with id' })
  @Post(':id/certificate')
  async createCertificate(
    @Param('id')
    id: string,
    @Body() cerDto: CreateCertificateDto,
  ) {
    return this.guardianService.createCertificate(cerDto, id);
  }

  @ApiOperation({ summary: " delete certification (certificateId) and remove it from guardian (id)" })
  @Delete(':id/certificate/:certificateId')
  async deleteCertificate(
    @Param('id')
    id: string,
    @Param('certificateId')
    certificateId: string,
  ) {
    return this.guardianService.deleteCertificate(id, certificateId);
  }

  @ApiOperation({ summary: 'Create a experience and add it to guardian with id' })
  @Post(':id/experience')
  async createExperience(
    @Param('id')
    id: string,
    @Body() experienceDto: CreateExperienceDto,
  ) {
    return this.guardianService.createExperience(experienceDto, id);
  }

  @ApiOperation({ summary: " delete experience (experienceId) and remove it from guardian (id)" })
  @Delete(':id/experience/:experienceId')
  async deleteExperience(
    @Param('id')
    id: string,
    @Param('experienceId')
    experienceId: string,
  ) {
    return this.guardianService.deleteExperience(id, experienceId);
  }
}
