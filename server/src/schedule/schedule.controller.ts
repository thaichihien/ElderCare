import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsObjectId } from '../utils/is-object-id.pipe';

@ApiTags('Schedule')
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @ApiOperation({ summary: "Create new schedule from guardian" })
  @Post()
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.create(createScheduleDto);
  }

  @ApiOperation({ summary: "Get all schedule from all guardian" })
  @Get()
  findAll() {
    return this.scheduleService.findAll();
  }

  @ApiOperation({ summary: "Get all available schedule from all guardian (startTime >= current date or isCycle == true)" })
  @Get()
  findAllAvailable() {
    return this.scheduleService.findAllAvailable();
  }

  @ApiOperation({ summary: "Find schedule with id" })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(id);
  }

  @ApiOperation({ summary: "Find all schedule of guardian with id" })
  @Get('guardian/:id')
  findScheduleGuardian(@Param('id',IsObjectId) id: string) {
    return this.scheduleService.findScheduleOfGuardian(id);
  }


  @ApiOperation({ summary: "Update schedule with id" })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto) {
    return this.scheduleService.update(id, updateScheduleDto);
  }

  @ApiOperation({ summary: "Delete schedule with id" })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(id);
  }

  

}
