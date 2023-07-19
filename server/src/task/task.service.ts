import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import mongoose from 'mongoose';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: mongoose.Model<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    let gid = createTaskDto.guardian;
    let aid = createTaskDto.aip;

    if (!mongoose.Types.ObjectId.isValid(gid)) {
      throw new BadRequestException('Invalid guardian id');
    }

    if (!mongoose.Types.ObjectId.isValid(aid)) {
      throw new BadRequestException('Invalid aip id');
    }

    createTaskDto.guardian = new mongoose.Types.ObjectId(gid);
    createTaskDto.aip = new mongoose.Types.ObjectId(aid);

    const newTask = await this.taskModel.create(createTaskDto);
    return newTask;
  }

  async findAll() {
    const tasks = await this.taskModel.find();
    return tasks;
  }

  async findByGuardianId(id: string) {
    const guardianTasks = await this.taskModel
      .find()
      .where('guardian')
      .equals(id);

    return guardianTasks;
  }

  async findOne(id: string) {
    const task = await this.taskModel.findById(id);

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const updated = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, {
      new: true,
    });

    return updated;
  }

  async remove(id: string) {
    return this.taskModel.findByIdAndDelete(id);
  }
}
