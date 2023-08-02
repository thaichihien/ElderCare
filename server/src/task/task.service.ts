import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import mongoose from 'mongoose';
import { ImageService } from 'src/image/image.service';
import { CreateImageDto } from 'src/image/dto/create-image.dto';
import { Schedule } from 'src/schedule/schemas/schedule.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: mongoose.Model<Task>,
    @InjectModel(Schedule.name)
    private scheduleTask: mongoose.Model<Schedule>,
    private imageSerive: ImageService,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    let gid = createTaskDto.guardian;
    let aid = createTaskDto.aip;
    let scheduleid = createTaskDto.schedule;

    if (!mongoose.Types.ObjectId.isValid(gid)) {
      throw new BadRequestException('Invalid guardian id');
    }

    if (!mongoose.Types.ObjectId.isValid(aid)) {
      throw new BadRequestException('Invalid aip id');
    }

    if (!mongoose.Types.ObjectId.isValid(scheduleid)) {
      throw new BadRequestException('Invalid schedule id');
    }

    const schedule = await this.scheduleTask.findById(scheduleid);

    if (!schedule) {
      throw new BadRequestException('Schedule not found');
    }

    if (createTaskDto.isCycle && !schedule.isCycle) {
      throw new BadRequestException(
        'This schedule does not repeat so this task cannot be repeated in this schedule',
      );
    }

    let deadline = schedule.startTime;
    deadline.setHours(23, 0, 0);
    createTaskDto.deadline = deadline;
    createTaskDto.guardian = new mongoose.Types.ObjectId(gid);
    createTaskDto.schedule = new mongoose.Types.ObjectId(scheduleid);
    createTaskDto.aip = new mongoose.Types.ObjectId(aid);

    const newTask = await this.taskModel.create(createTaskDto);
    return newTask;
  }

  async findAll() {
    const tasks = await this.taskModel.find().populate('image');
    return tasks;
  }

  async findAllAvailable() {
    const tasks = await this.taskModel
      .find()
      .where('deadline')
      .gte(new Date().getTime())
      .populate('image');
    return tasks;
  }

  async findByGuardianId(id: string) {
    const guardianTasks = await this.taskModel
      .find()
      .where('guardian')
      .equals(id)
      .where('deadline')
      .gte(new Date().getTime())
      .populate('image');

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

  convertTimestamp(src: string): string {
    const timeList = src.split(' ');
    const dmy = timeList[0].replaceAll(':', '-');

    const dateString = dmy + 'T' + timeList[1] + 'Z';
    return dateString;
  }

  async uploadImage(id: string, file: Express.Multer.File) {
    // - extract data

    const exifData = await this.imageSerive.getExifData(file);

    //console.log(exifData);

    // - upload image to cloud

    const imageUrl = await this.imageSerive.saveImageToCloud(file);

    const lat = this.imageSerive.convertDMSToDD(
      exifData.gps.GPSLatitude,
      exifData.gps.GPSLatitudeRef,
    );
    const long = this.imageSerive.convertDMSToDD(
      exifData.gps.GPSLongitude,
      exifData.gps.GPSLongitudeRef,
    );

    // console.log('lat : ' + lat);
    // console.log('long : ' + long);

    const dateString = this.convertTimestamp(exifData.exif.CreateDate);

    //const date = new Date(dateString)

    //console.log(date.toISOString())

    const address = await this.imageSerive.getAddressStringFrom(lat, long);

    //console.log('address : ' + address)

    // - save to database
    const imageDto: CreateImageDto = {
      link: imageUrl,
      latitude: lat,
      longitude: long,
      address: address,
      time: new Date(dateString),
      task: id,
    };

    const image = await this.imageSerive.saveImageToDatabase(imageDto);

    await this.taskModel.findByIdAndUpdate(id, {
      isDone: true,
      image: image._id,
    });
  }

  async updateAllTaskDeadline() {
    await this.taskModel.updateMany(
      {
        isCycle: true,
        deadline: { $lt: new Date() },
      },
      [
        {
          $set: {
            deadline: {
              $dateAdd: {
                startDate: '$deadline',
                unit: 'day',
                amount: 7,
              },
            },
            isDone : false
          },
        },
      ],
    );
  }
}
