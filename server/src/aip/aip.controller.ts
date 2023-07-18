import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';

import { AipService } from './aip.service';
import { AipDto } from './dto/aip.dto';
import { Aip } from './schemas/aip.schema';
import { IsObjectId } from 'src/utils/is-object-id.pipe';
import { isStringObject } from 'util/types';

@Controller('aip')
export class AipController {

    constructor(private aipService: AipService) { }

    @Post()
    async createAip(
        @Body()
        aip: AipDto,
    ): Promise<Aip> {
        return this.aipService.create(aip)
    }

    @Get(':id')
    async findAipById(
        @Param('id', IsObjectId)
        id: string
    ): Promise<Aip> {
        return this.aipService.findById(id)
    }

    @Get()
    async findAll(): Promise<Aip[]> {
        return this.aipService.findAll();
    }

    @Get('/CCCD/:CCCD')
    async findByCCCD(
        @Param('CCCD')
        CCCD: string
    ): Promise<Aip[]> {
        return this.aipService.findByCCCD(CCCD)
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() aip: AipDto
    ): Promise<Aip> {
        return this.aipService.update(id, aip)
    }

    @Delete(':id')
    async delete(
        @Param('id')
        id: string
    ): Promise<void> {
        return this.aipService.delete(id)
    }
}
