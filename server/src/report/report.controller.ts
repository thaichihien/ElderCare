import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { IsObjectId } from 'src/utils/is-object-id.pipe';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Report } from './schemas/report.schema';
import { ReportDto } from './dto/report.dto';

@ApiTags('Report')
@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Post()
  create(@Query('guardianId') guardianId: string, 
          @Query('aipId') aipId: string,
          @Body() createReportDto: CreateReportDto): Promise<Report> {

    return this.reportService.create(guardianId, aipId, createReportDto);
  }

  @Get()
  findAll(): Promise<ReportDto[]> {
    return this.reportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', IsObjectId) id: string): Promise<ReportDto> {
    return this.reportService.findOne(id);
  }

  // @Get('guardian/:guardianId')
  // findReportByGuardianId(@Param('guardianId') guardianId: string): Promise<ReportDto[]> {
  //   return this.reportService.findReportByGuardianId(guardianId);
  // }

  @ApiOperation({ summary: 'Get reports by guardianId and date' })
  @Get('guardian/:guardianId')
  @ApiQuery({
    name: 'date',
    required: true,
    description: 'The date parameter in the format yyyy-MM-dd',
  })
  findReportByGuardianIdAndDate(@Param('guardianId') guardianId: string,
                                @Query('date') date: string): Promise<ReportDto[]> {
    return this.reportService.findReportByGuardianIdAndDate(guardianId, date);
  }

  @Patch(':id')
  update(@Param('id', IsObjectId) id: string, @Body() updateReportDto: UpdateReportDto): Promise<Report> {
    return this.reportService.update(id, updateReportDto);
  }

  @Delete(':id')
  remove(@Param('id', IsObjectId) id: string): Promise<void> {
    return this.reportService.remove(id);
  }
}
