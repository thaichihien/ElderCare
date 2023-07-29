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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Guardian')
@Controller('guardian')
export class GuardianController {
  constructor(private guardianService: GuardianService) {}
  @Post()
  async createGuardian(
    @Body()
    guardian: CreateGuardianDto,
  ): Promise<Guardian> {
    return this.guardianService.create(guardian);
  }

  @Get(':id')
  async findGuardianById(
    @Param('id', IsObjectId)
    id: string,
  ): Promise<Guardian> {
    return this.guardianService.findById(id);
  }

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

  @Patch(':id?')
  async updateLevel(
    @Param('id') id: string,
    @Query('level') level: string,
  ): Promise<Guardian> {
    return this.guardianService.updateLevel(id, level);
  }

  @ApiOperation({ summary: 'Upload certification image' })
  @Post('/certification/upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCertificationImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return this.guardianService.uploadCertificationImage(file, id);
  }

  @ApiOperation({ summary: 'upload certification from guardian' })
  @Post('certification/:id')
  async createCertification(
    @Param('id')
    id: string,
    @Body() cerDto: CreateCertificationDto,
  ) {
    return this.guardianService.createCertification(cerDto, id);
  }
}
