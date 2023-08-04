import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { AipService } from './aip.service';
import { AipDto } from './dto/aip.dto';
import { Aip } from './schemas/aip.schema';
import { IsObjectId } from '../utils/is-object-id.pipe';
import { AipAssignDto } from './dto/aip-assign.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AipHealthStatusDto } from './dto/aip-healthStatus.dto';
import { AipNoteDto } from './dto/aip-note.dto';
import { AipDateDto } from './dto/aip-date.dto';
import { Task } from 'src/task/schemas/task.schema';

@ApiTags('Aip')
@Controller('aip')
export class AipController {
  constructor(private aipService: AipService) {}

  @Post()
  async createAip(
    @Body()
    aip: AipDto,
  ): Promise<Aip> {
    return this.aipService.create(aip);
  }

  @Get(':id')
  async findAipById(
    @Param('id', IsObjectId)
    id: string,
  ): Promise<Aip> {
    return this.aipService.findById(id);
  }

  @Get()
  async findAll(): Promise<Aip[]> {
    return this.aipService.findAll();
  }

  @Get('/CCCD/:CCCD')
  async findByCCCD(
    @Param('CCCD')
    CCCD: string,
  ): Promise<Aip[]> {
    return this.aipService.findByCCCD(CCCD);
  }

  @ApiOperation({ summary: 'Get aips by guardianId and date' })
  @Get('/guardian/:guardianId')
  @ApiQuery({ name: 'date', required: true, description: 'The date parameter in the format yyyy-MM-dd' })
  async findAipsByGuardianAndDate(
    @Param('guardianId') guardianId: string,
    @Query('date') date: string
  ): Promise<Aip[]> {

    return this.aipService.findAipsByGuardianAndDate(guardianId, date);
  }

  @Put('unassign/:id')
  async unassign(@Param('id', IsObjectId) id: string): Promise<Aip> {
    return this.aipService.unassignGuardian(id);
  }

  @Put('assign/:id')
  async assign(
    @Param('id', IsObjectId) id: string,
    @Body() aip: AipAssignDto,
  ): Promise<Aip> {
    return this.aipService.assignGuardian(id, aip.guardianId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() aip: AipDto): Promise<Aip> {
    return this.aipService.update(id, aip);
  }

  @Put('health-status/:id')
  async updateHealthStatus(
    @Param('id') id: string,
    @Body() aip: AipHealthStatusDto
  ): Promise<Aip> {
    return this.aipService.updateHealthStatus(id, aip);
  } 

  @Put('note/:id')
  async updateNote(
    @Param('id') id: string,
    @Body() aip: AipNoteDto
  ): Promise<Aip> {
    return this.aipService.updateNote(id, aip);
  } 

  @Delete(':id')
  async delete(
    @Param('id')
    id: string,
  ): Promise<void> {
    return this.aipService.delete(id);
  }
}
