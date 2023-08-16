import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { IsObjectId } from 'src/utils/is-object-id.pipe';
import { isStringObject } from 'util/types';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CallService } from './call.service';
import { CreateCallDto } from './dto/create-call.dto';
import { Call } from './schemas/call.schema';
import { UpdateCallDto } from './dto/update-call.to';


@ApiTags('Call')
@Controller('call')
export class CallController {
    constructor(private callService: CallService) { }

    @ApiOperation({ summary: 'Create a new call and Reason must be {DeclinedCall, TimeOut}, null if successful' })
    @Post()
    async createCall(
        @Query('guardianId') guardianId: string,
        @Body() call: CreateCallDto,
    ): Promise<Call> {
        return this.callService.create(guardianId, call);
    }

    @ApiOperation({ summary: 'Find a call with id' })
    @Get(':id')
    async findCallById(
        @Param('id', IsObjectId)
        id: string,
    ): Promise<Call> {
        return this.callService.findById(id);
    }

    @ApiOperation({ summary: 'Get all calls' })
    @Get()
    async findAll(): Promise<Call[]> {
        return this.callService.findAll();
    }

    @Get('guardian/:guardianId')
    findCallByGuardianId(@Param('guardianId') guardianId: string): Promise<Call[]> {
        return this.callService.findByGuardianId(guardianId);
    }

    @ApiOperation({ summary: 'get calls to guardian statistics with id' })
    @Get('statistics/:guardienId')
    statistics(@Param('guardienId') guardienId: string) {
        return this.callService.statCallsToGuardianWithID(guardienId);
    }

    @ApiOperation({ summary: 'Create a new call and Reason must be {DeclinedCall, TimeOut}, null if successful' })
    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() call: UpdateCallDto,
    ): Promise<Call> {
        return this.callService.update(id, call);
    }

    @Delete(':id')
    async delete(
        @Param('id')
        id: string,
    ): Promise<void> {
        return this.callService.delete(id);
    }
}