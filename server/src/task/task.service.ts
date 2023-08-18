import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CreateImageDto } from 'src/image/dto/create-image.dto';
import { ImageService } from 'src/image/image.service';
import { Schedule } from 'src/schedule/schemas/schedule.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import Task from './schemas/task.schema';
import { checkObjectIdValid } from 'src/common/exception/object-id-invalid-exception';
import { Aip } from '../aip/schemas/aip.schema';
import {
  MAX_DISTANCE_METER,
  getDistanceFromLatLonInM,
} from 'src/common/utils/calculate-distance';
import { GuardianService } from 'src/guardian/guardian.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: mongoose.Model<Task>,
    @InjectModel(Schedule.name)
    private scheduleTask: mongoose.Model<Schedule>,
    @InjectModel(Aip.name)
    private aipModel: mongoose.Model<Aip>,
    private imageSerive: ImageService,
    private guardianService: GuardianService,
  ) {}

  /**
   * Create a new task for guardian
   * @param createTaskDto
   * @returns
   */
  async create(createTaskDto: CreateTaskDto) {
    const gid = createTaskDto.guardian;
    const aid = createTaskDto.aip;
    const scheduleid = createTaskDto.schedule;

    // if (!mongoose.Types.ObjectId.isValid(gid)) {
    //   throw new BadRequestException('Invalid guardian id');
    // }

    // if (!mongoose.Types.ObjectId.isValid(aid)) {
    //   throw new BadRequestException('Invalid aip id');
    // }

    // if (!mongoose.Types.ObjectId.isValid(scheduleid)) {
    //   throw new BadRequestException('Invalid schedule id');
    // }

    checkObjectIdValid(gid, 'Invalid guardian id');
    checkObjectIdValid(aid, 'Invalid aip id');
    checkObjectIdValid(scheduleid, 'Invalid schedulecd id');

    const schedule = await this.scheduleTask.findById(scheduleid);

    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }

    if (createTaskDto.isCycle && !schedule.isCycle) {
      throw new BadRequestException(
        'This schedule does not repeat so this task cannot be repeated in this schedule',
      );
    }

    const deadline = schedule.startTime;
    deadline.setHours(23, 0, 0);
    createTaskDto.deadline = deadline;
    createTaskDto.guardian = new mongoose.Types.ObjectId(gid);
    createTaskDto.schedule = new mongoose.Types.ObjectId(scheduleid);
    createTaskDto.aip = new mongoose.Types.ObjectId(aid);

    const newTask = await this.taskModel.create(createTaskDto);
    return newTask;
  }

  /**
   *
   * @returns all the tasks of all guardians
   */
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

  /**
   *
   * @param id guardian id
   * @param date deadline of the task. If it not given, returns all the tasks
   * @returns all the tasks of a guardian
   */
  async findByGuardianId(id: string, date: string, aipId: string) {
    let guardianTasks;
    if (date) {
      const startDateSearch = new Date(date);
      const endDateSearch = new Date(date);

      if (!startDateSearch.valueOf()) {
        throw new BadRequestException('invalid date format');
      }

      startDateSearch.setHours(1, 0, 0);
      endDateSearch.setHours(23, 59, 0);

      // console.log(startDateSearch)
      // console.log(endDateSearch)

      if (aipId) {
        guardianTasks = await this.taskModel
          .find()
          .where('guardian')
          .equals(id)
          .where('aip')
          .equals(aipId)
          .where('deadline')
          .gte(startDateSearch.getTime())
          .lte(endDateSearch.getTime())
          .populate('image')
          .populate('aip');
      } else {
        guardianTasks = await this.taskModel
          .find()
          .where('guardian')
          .equals(id)
          .where('deadline')
          .gte(startDateSearch.getTime())
          .lte(endDateSearch.getTime())
          .populate('image')
          .populate('aip');
      }
    } else {
      if (aipId) {
        guardianTasks = await this.taskModel
          .find()
          .where('guardian')
          .equals(id)
          .where('aip')
          .equals(aipId)
          .where('deadline')
          .gte(new Date().getTime())
          .populate('image')
          .populate('aip');
      } else {
        guardianTasks = await this.taskModel
          .find()
          .where('guardian')
          .equals(id)
          .where('deadline')
          .gte(new Date().getTime())
          .populate('image')
          .populate('aip');
      }
    }

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
    const dateString = this.convertTimestamp(exifData.exif.CreateDate);
    const address = await this.imageSerive.getAddressStringFrom(lat, long);

    // - get coordiante from aip

    const task = await this.taskModel.findById(id);
    const aip = await this.aipModel.findById(task.aip);
    let isDone = false;
    let aipPlacePoint;
    const imageTaskPoint = {
      lat: lat,
      long: long,
    };
    if (!aip) {
      throw new BadRequestException('aip not found');
    }

    if (!aip.coordinates) {
      // - if not call from api
      const coordiantes = await this.imageSerive.getPointFromAddress(
        aip.address,
      );
      aipPlacePoint = coordiantes;
    } else {
      aipPlacePoint = {
        lat: aip.coordinates.lat,
        long: aip.coordinates.long,
      };
    }

    // - calculate 2 point

    const dis = getDistanceFromLatLonInM(
      imageTaskPoint.lat,
      imageTaskPoint.long,
      aipPlacePoint.lat,
      aipPlacePoint.long,
    );

    // - check if distance > MAX_DISTANCE_METER
    console.log(dis);
    if (dis > MAX_DISTANCE_METER) {
      isDone = false;
    } else {
      isDone = true;
    }

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
      isDone: isDone,
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
            isDone: false,
          },
        },
      ],
    );
  }

  async statGuardianTask(guardianId: string, date: string) {
    if (guardianId) {
      return this.statGuardianTaskWithID(guardianId, date);
    }

    const guardianIds = await this.guardianService.getAllGuardianId();
    const guardianStatisticsList = [];

    for (let index = 0; index < guardianIds.length; index++) {
      const id = guardianIds[index].toString();

      const guardianStatistics = await this.statGuardianTaskWithID(id, date);
      guardianStatisticsList.push(guardianStatistics);
    }

    // const guardianStatistics = {
    //   total : total,
    //   done : done,
    //   not_done : notDone
    // }

    return guardianStatisticsList;
  }

  async statGuardianTaskWithID(guardianId: string, from: string) {
    let total: number;
    let done: number;
    let notDone: number;
    if (!from) {
      total = await this.taskModel.count({
        guardian: guardianId,
        deadline: { $lt: new Date() },
      });
      notDone = await this.taskModel.count({
        guardian: guardianId,
        isDone: false,
        deadline: { $lt: new Date() },
      });
      done = await this.taskModel.count({
        guardian: guardianId,
        isDone: true,
        deadline: { $lt: new Date() },
      });
    } else {
      const fromDate = new Date(from);

      if (!fromDate.valueOf()) {
        throw new BadRequestException('invalid date');
      }

      total = await this.taskModel.count({
        guardian: guardianId,
        deadline: {
          $gte: fromDate,
          $lt: new Date(),
        },
      });
      notDone = await this.taskModel.count({
        guardian: guardianId,
        isDone: false,
        deadline: {
          $gte: fromDate,
          $lt: new Date(),
        },
      });
      done = await this.taskModel.count({
        guardian: guardianId,
        isDone: true,
        deadline: {
          $gte: fromDate,
          $lt: new Date(),
        },
      });
    }

    const guardianStatistics = {
      guardian: guardianId,
      total: total,
      done: done,
      not_done: notDone,
    };

    return guardianStatistics;
  }
}
