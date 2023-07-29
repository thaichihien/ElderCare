import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Schedule } from './schemas/schedule.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Schedule')
@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name)
    private scheduleModel: mongoose.Model<Schedule>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto) {

    // ! Check if id is valid

    const created = await this.scheduleModel.create(createScheduleDto);
    return created;
  }

  async findAll() {
    const all = await this.scheduleModel.find();
    return all;
  }

  async findAllAvailable() {
    const all = await this.scheduleModel.find().or([
      {
        startTime : { $gte : new Date()}
      },
      {
        isCycle : true
      }
    ]);
    return all;
  }

  async findOne(id: string) {
    const one = await this.scheduleModel.findById(id);
    return one;
  }

  async findScheduleOfGuardian(id: string) {
    const schedules = await this.scheduleModel.find().where('guardian').equals(id)
    return schedules;
  }


  async update(id: string, updateScheduleDto: UpdateScheduleDto) {
    const updated = await this.scheduleModel.findByIdAndUpdate(
      id,
      updateScheduleDto,
      {
        new: true,
      },
    );
    return updated;
  }

  async remove(id: string) {
    return await this.scheduleModel.findByIdAndDelete(id);
  }
}
