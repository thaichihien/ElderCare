import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Guardian } from './schemas/guardian.schema';
import mongoose from 'mongoose';
import { CreateGuardianDto } from './dto/create-guardian.dto'; 

@Injectable()
export class GuardianService {
    constructor(
        @InjectModel(Guardian.name)
        private GuardianModel: mongoose.Model<Guardian>,
    ) { }

    async findAll(): Promise<Guardian[]> {
        const guardians = await this.GuardianModel.find();
        return guardians;
    }

    async findById(id: string): Promise<Guardian> {
        const guardian = await this.GuardianModel.findById(id);

        if (!guardian) {
            throw new NotFoundException(`Guardian not found with id ${id}`);
        }

        return guardian;
    }

    async findByCCCD(CCCD: string): Promise<Guardian> {
        const guardian = await this.GuardianModel
            .find()
            .where('CCCD').equals(CCCD)

        if (guardian.length <= 0) {
            throw new NotFoundException('Guardian not found')
        }

        return guardian[0];
    }

    async create(guardian: CreateGuardianDto): Promise<Guardian> {
        const created = await this.GuardianModel.create(guardian);
        return created;
    }

    async update(id: string, guardian: CreateGuardianDto): Promise<Guardian> {
        const updated = await this.GuardianModel.findByIdAndUpdate(id, guardian, {new: true})

        return updated
    }

    async delete(id: string): Promise<void> {
        await this.GuardianModel.findByIdAndDelete(id)
    }
}
