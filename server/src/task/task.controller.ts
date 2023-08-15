import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { IsObjectId } from '../utils/is-object-id.pipe';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: 'Create new task for guardian' })
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @ApiOperation({ summary: 'Get all task' })
  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @ApiOperation({
    summary: 'Get all task (only tasks with deadline >= current date)',
  })
  @Get('available')
  findAllAvailable() {
    return this.taskService.findAllAvailable();
  }

  @ApiOperation({
    summary:
      'Get all task of a guardian (only tasks with deadline >= current date)',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    example: '2023-08-03',
    description:
      'format : YYYY-MM-DD, if date is not provided,get all task of a guardian with deadline >= current date ',
  })
  @ApiQuery({
    name: 'aip-id',
    required: false,
    example: '',
    description:
      'id of aip, if not given, return all task related to all aip of guardian',
  })
  @Get('/guardian/:id')
  findByGuardianId(
    @Param('id', IsObjectId) id: string,
    @Query('date') date: string,
    @Query('aip-id') aipId: string,
  ) {
    return this.taskService.findByGuardianId(id, date, aipId);
  }

  @ApiOperation({ summary: 'Upload task image' })
  @Post('/upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return this.taskService.uploadImage(id, file);
  }

  @ApiOperation({
    summary:
      'update all the deadline of tasks whose isCycle is true (this api is only called automatically on the last day of the week, do not use this api)',
  })
  @Get('refresh')
  updateDeadline() {
    return this.taskService.updateAllTaskDeadline();
  }

  @ApiQuery({
    name: 'date',
    required: false,
    example: '2023-08-03',
    description:
      'format : YYYY-MM-DD, only the statistics of the tasks starting from this date are counted if date is provided',
  })
  @ApiOperation({ summary: 'get all  guardian task statistics' })
  @Get('statistics')
  statisticsAll(@Query('date') date: string) {
    return this.taskService.statGuardianTask(null, date);
  }

  @ApiQuery({
    name: 'date',
    required: false,
    example: '2023-08-03',
    description:
      'format : YYYY-MM-DD,  only the statistics of the tasks starting from this date are counted if date is provided ',
  })
  @ApiOperation({ summary: 'get guardian task statistics with id' })
  @Get('statistics/:id')
  statistics(@Param('id') id: string, @Query('date') date: string) {
    return this.taskService.statGuardianTask(id, date);
  }

  @ApiOperation({ summary: 'Find task with id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @ApiOperation({ summary: 'Update task with id' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(id, updateTaskDto);
  }

  @ApiOperation({ summary: 'Delete task with id' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }
}
