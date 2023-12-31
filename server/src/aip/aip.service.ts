import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import {
  endOfDay,
  format,
  isValid,
  parse,
  parseISO,
  startOfDay,
} from 'date-fns';
import mongoose from 'mongoose';
import Task from 'src/task/schemas/task.schema';
import { AipDateDto } from './dto/aip-date.dto';
import { AipHealthStatusDto } from './dto/aip-healthStatus.dto';
import { AipNoteDto } from './dto/aip-note.dto';
import { AipDto } from './dto/aip.dto';
import { Aip } from './schemas/aip.schema';
import { Guardian } from '../guardian/schemas/guardian.schema';
import { Report } from '../report/schemas/report.schema';


@Injectable()
export class AipService {
  constructor(
    @InjectModel(Aip.name)
    private aipModel: mongoose.Model<Aip>,

    @InjectModel(Task.name)
    private taskModel: mongoose.Model<Task>,
    @InjectModel(Guardian.name)
    private guardianModel: mongoose.Model<Guardian>,
    @InjectModel(Report.name)
    private reportModel: mongoose.Model<Report>,
  ) { }

  async findAll(): Promise<Aip[]> {
    const aips = await this.aipModel.find();
    return aips;
  }

  async findById(id: string): Promise<Aip> {
    const aip = await this.aipModel.findById(id);

    if (!aip) {
      throw new NotFoundException(`aip not found with id ${id}`);
    }

    return aip;
  }

  async findByCCCD(CCCD: string): Promise<Aip> {
    const aip = await this.aipModel.findOne({
      CCCD: CCCD
    });

    if (!aip) {
      throw new NotFoundException('aip not found');
    }

    return aip;
  }

  async findAipsByGuardianAndDate(
    guardianId: string,
    date: string,
  ): Promise<Aip[]> {
    const startOfDay = new Date(date);

    const endOfDay = new Date(date);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const tasks = await this.taskModel.find({
      guardian: guardianId,
      deadline: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });
    const aipIds = tasks.map((task) => task.aip); // Lấy danh sách các ObjectId của Aip

    const aips = await this.aipModel
      .find({ _id: { $in: aipIds } })
      .select('_id firstName lastName dateOfBirth address');

    return aips;
  }

  async findUnreportedAIPByGuardianAndDate(
    guardianId: string,
    date: string,
  ): Promise<Aip[]> {
    
    const startOfDay = new Date(date);

    const endOfDay = new Date(date);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const tasks = await this.taskModel.find({
      guardian: guardianId,
      deadline: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });
    const aipIds = tasks.map((task) => task.aip); // Lấy danh sách các ObjectId của Aip

    const reports = await this.reportModel.find({ guardian: guardianId, date: date });

    const reportedAip = reports.map(report => report.aip);

    const unreportedAip: Aip[] = [];

    for (const aip of aipIds) {

      const isReported = reportedAip.some(aipR => aipR.toString() === aip.toString());
      if (!isReported) {
        unreportedAip.push(aip);
      }
    }

    const aips = await this.aipModel
    .find({ _id: { $in: unreportedAip } })
    .select('_id firstName lastName dateOfBirth address');

    return aips;
  }

  async create(aip: AipDto): Promise<Aip> {
    const checkExist = await this.aipModel.findOne({
      CCCD: aip.CCCD,
    });

    if (checkExist) {
      throw new BadRequestException('This Aip already exists in the database');
    }

    const created = await this.aipModel.create(aip);
    return created;
  }

  async update(id: string, aip: AipDto): Promise<Aip> {
    const updated = await this.aipModel.findByIdAndUpdate(id, aip, {
      new: true,
    });

    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.aipModel.findByIdAndDelete(id);
  }

  async assignGuardian(aipId: string, guardianId: string): Promise<Aip> {

    const checkGuardian = await this.guardianModel.findById(guardianId)

    if (!checkGuardian) {
      throw new BadRequestException('Guardian not found')
    }


    const updated = await this.aipModel.findByIdAndUpdate(
      aipId,
      {
        guardian: checkGuardian._id,
      },
      { new: true },
    );

    if (!updated) {
      throw new BadRequestException('Aip not found')
    }

    return updated;
  }

  async unassignGuardian(aipId: string): Promise<Aip> {
    const updated = await this.aipModel.findByIdAndUpdate(
      aipId,
      {
        guardian: null,
      },
      { new: true },
    );

    return updated;
  }

  async updateHealthStatus(
    apiId: string,
    aipHealthStatus: AipHealthStatusDto,
  ): Promise<Aip> {
    const aip = await this.aipModel.findById(apiId);

    if (!aip) {
      throw new NotFoundException(`aip not found with id ${apiId}`);
    }

    aip.healthStatus = aipHealthStatus.healthStatus;

    const updated = await this.aipModel.findByIdAndUpdate(apiId, aip, {
      new: true,
    });

    return updated;
  }

  async updateNote(apiId: string, aipNoteDto: AipNoteDto): Promise<Aip> {
    const aip = await this.aipModel.findById(apiId);

    if (!aip) {
      throw new NotFoundException(`aip not found with id ${apiId}`);
    }

    aip.note = aipNoteDto.note;

    const updated = await this.aipModel.findByIdAndUpdate(apiId, aip, {
      new: true,
    });

    return updated;
  }
}
