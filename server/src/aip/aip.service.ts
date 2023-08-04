import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Aip } from './schemas/aip.schema';
import mongoose from 'mongoose';
import { AipDto } from './dto/aip.dto';
import { AipHealthStatusDto } from './dto/aip-healthStatus.dto';
import { AipNoteDto } from './dto/aip-note.dto';
import { Task } from 'src/task/schemas/task.schema';
import { endOfDay, format, isValid, parse, parseISO, startOfDay } from 'date-fns';
import { AipDateDto } from './dto/aip-date.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AipService {

    constructor(
        @InjectModel(Aip.name)
        private aipModel: mongoose.Model<Aip>,

        @InjectModel(Task.name)
        private taskModel: mongoose.Model<Task>,
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

    async findByCCCD(CCCD: string): Promise<Aip[]> {
        const aip = await this.aipModel
            .find()
            .where('CCCD').equals(CCCD)

        if (aip.length <= 0) {
            throw new NotFoundException('aip not found')
        }

        return aip;
    }

    async findAipsByGuardianAndDate(guardianId: string, date: string): Promise<Aip[]> {

        const startOfDay = new Date(date);

        const endOfDay = new Date(date);
        endOfDay.setDate(endOfDay.getDate() + 1);

        console.log(startOfDay);
        console.log(format(startOfDay, "dd-MM-yyyy"))
        console.log(endOfDay);
        console.log(format(endOfDay, "dd-MM-yyyy"))

        const tasks = await this.taskModel.find({
            guardian: guardianId,
            deadline: {
                $gte: startOfDay,
                $lt: endOfDay,
            },
        });
        const aipIds = tasks.map((task) => task.aip); // Lấy danh sách các ObjectId của Aip

        const aips = await this.aipModel.find({ _id: { $in: aipIds } }).select('_id firstName lastName dateOfBirth address');

        console.log(aips)

        return aips;
    }

    async create(aip: AipDto): Promise<Aip> {
        const created = await this.aipModel.create(aip);
        return created;
    }

    async update(id: string, aip: AipDto): Promise<Aip> {
        const updated = await this.aipModel.findByIdAndUpdate(id, aip, { new: true })

        return updated
    }

    async delete(id: string): Promise<void> {
        await this.aipModel.findByIdAndDelete(id)
    }

    async assignGuardian(aipId: string, guardianId: string,) {

        const guardianObjectId = new mongoose.Types.ObjectId(guardianId)

        const updated = await this.aipModel.findByIdAndUpdate(aipId, {
            guardian: guardianObjectId
        }, { new: true })

        console.log(updated)

        return updated
    }

    async unassignGuardian(aipId: string) {

        const updated = await this.aipModel.findByIdAndUpdate(aipId, {
            guardian: null
        }, { new: true })

        return updated
    }

    async updateHealthStatus(apiId: string, aipHealthStatus: AipHealthStatusDto): Promise<Aip> {

        const aip = await this.aipModel.findById(apiId);

        if (!aip) {
            throw new NotFoundException(`aip not found with id ${apiId}`);
        }

        aip.healthStatus = aipHealthStatus.healthStatus;

        const updated = await this.aipModel.findByIdAndUpdate(apiId, aip, { new: true })

        return updated
    }

    async updateNote(apiId: string, aipNoteDto: AipNoteDto): Promise<Aip> {

        const aip = await this.aipModel.findById(apiId);

        if (!aip) {
            throw new NotFoundException(`aip not found with id ${apiId}`);
        }

        aip.note = aipNoteDto.note;

        const updated = await this.aipModel.findByIdAndUpdate(apiId, aip, { new: true })

        return updated
    }
}
