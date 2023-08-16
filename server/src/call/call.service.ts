import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import mongoose from 'mongoose';
import { Call } from './schemas/call.schema';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.to';
import { Guardian } from 'src/guardian/schemas/guardian.schema';

@Injectable()
export class CallService {
    constructor(
        @InjectModel(Call.name)
        private callModel: mongoose.Model<Call>,

        @InjectModel(Guardian.name)
        private guardianModel: mongoose.Model<Guardian>,
    ) { }

    async findAll(): Promise<Call[]> {
        const calls = await this.callModel.find();
        return calls;
    }

    async findById(id: string): Promise<Call> {
        const call = await this.callModel.findById(id);

        if (!call) {
            throw new NotFoundException(`call not found with id ${id}`);
        }

        return call;
    }

    async findByGuardianId(guardianId: string): Promise<Call[]> {
        const calls = await this.callModel.find({ guardian: guardianId });

        if (!calls) {
            throw new NotFoundException(`call not found with id ${guardianId}`);
        }

        return calls;
    }

    async create(guardianId: string, call: CreateCallDto): Promise<Call> {

        const { ...createCallDto } = call;

        const guardian = await this.guardianModel.findById(guardianId);
        if (!guardian) {
            throw new NotFoundException(`Guardian not found with id ${guardianId}`);
        }

        const created = new this.callModel({
            guardian,
            ...createCallDto,
        });

        return created.save();
    }

    async update(id: string, call: UpdateCallDto): Promise<Call> {
        const updated = await this.callModel.findByIdAndUpdate(id, call, {
            new: true,
        });

        return updated;
    }

    async delete(id: string): Promise<void> {
        await this.callModel.findByIdAndDelete(id);
    }

    async statCallsToGuardianWithID(guardianId: string) {
        let total: number;
        let success: number;
        let failure: number;

        total = await this.callModel.count({
            guardian: guardianId,
        });
        success = await this.callModel.count({
            guardian: guardianId,
            isSuccessful: true,
        });
        failure = await this.callModel.count({
            guardian: guardianId,
            isSuccessful: false,
        });

        const callToGuardianStatistics = {
            guardian: guardianId,
            total,
            success,
            failure,
        };

        return callToGuardianStatistics;
    }
}