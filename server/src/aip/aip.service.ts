import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Aip } from './schemas/aip.schema';
import mongoose from 'mongoose';
import { AipDto } from './dto/aip.dto';

@Injectable()
export class AipService {

    constructor(
        @InjectModel(Aip.name)
        private aipModel: mongoose.Model<Aip>,
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

    async create(aip: AipDto): Promise<Aip> {
        const created = await this.aipModel.create(aip);
        return created;
    }

    async update(id: string, aip: AipDto): Promise<Aip> {
        const updated = await this.aipModel.findByIdAndUpdate(id, aip, {new: true})

        return updated
    }

    async delete(id: string): Promise<void> {
        await this.aipModel.findByIdAndDelete(id)
    }
}
