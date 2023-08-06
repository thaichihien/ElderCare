import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { IsObjectId } from '../utils/is-object-id.pipe';

@ApiTags('Schedule')
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @ApiOperation({ summary: 'Create new schedule from guardian' })
  @Post()
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.create(createScheduleDto);
  }

  @ApiOperation({ summary: 'Get all schedule from all guardian' })
  @Get()
  findAll() {
    return this.scheduleService.findAll();
  }

  @ApiOperation({
    summary:
      'Get all available schedule from all guardian (startTime >= current date or isCycle == true)',
  })
  @Get()
  findAllAvailable() {
    return this.scheduleService.findAllAvailable();
  }

  @ApiOperation({ summary: 'Find schedule with id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(id);
  }

  @ApiQuery({
    name: 'date',
    required: false,
    example: '2023-08-03',
    description:
      'format : YYYY-MM-DD, get all schedule from monday to saturday of the week for which date is provided. If date is not provided, the current day will be selected\n' +
      "For example : the date query provided is '2023-08-06', get all schedule from 31/07/2023 (Monday) to 05/08/2023 (Saturday)",
  })
  @ApiOperation({ summary: 'Find all schedule of guardian with id in a week' })
  @Get('guardian/:id/week')
  findScheduleGuardianCurrentWeek(
    @Param('id', IsObjectId) id: string,
    @Query('date') date: string,
  ) {
    return this.scheduleService.findScheduleOfGuardianCurrentWeek(id, date);
  }

  @ApiQuery({
    name: 'date',
    required: false,
    example: '2023-08-03',
    description:
      'format : YYYY-MM-DD, if date is not provided,get all schedule of a guardian ',
  })
  @ApiOperation({ summary: 'Find all schedule of guardian with id' })
  @Get('guardian/:id')
  findScheduleGuardian(
    @Param('id', IsObjectId) id: string,
    @Query('date') date: string,
  ) {
    return this.scheduleService.findScheduleOfGuardian(id, date);
  }

 

  @ApiOperation({ summary: 'Update schedule with id' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.scheduleService.update(id, updateScheduleDto);
  }

  @ApiOperation({ summary: 'Delete schedule with id' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(id);
  }
}
