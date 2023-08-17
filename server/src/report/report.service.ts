import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { isValidObjectId } from 'mongoose';
import { Guardian } from 'src/guardian/schemas/guardian.schema';
import { Aip } from 'src/aip/schemas/aip.schema';
import { Report } from './schemas/report.schema';
import { ReportDto } from './dto/report.dto';

@Injectable()
export class ReportService {

  constructor(
    @InjectModel(Report.name)
    private reportModel: mongoose.Model<Report>,

    @InjectModel(Guardian.name)
    private guardianModel: mongoose.Model<Guardian>,

    @InjectModel(Aip.name)
    private aipModel: mongoose.Model<Aip>,
  ) { }

  async create(guardianId: string, aipId: string, createReportDto: CreateReportDto): Promise<Report> {

    const { ...reportData } = createReportDto;

    const guardian = await this.guardianModel.findById(guardianId);
    if (!guardian) {
      throw new NotFoundException(`Guardian not found with id ${guardianId}`);
    }

    const aip = await this.aipModel.findById(aipId);
    if (!aip) {
      throw new NotFoundException(`Aip not found with id ${aipId}`);
    }

    const newReport = new this.reportModel({
      guardian,
      aip,
      ...reportData,
    });

    newReport.save()
    return;
  }

  async findAll(): Promise<ReportDto[]> {

    const reports = await this.reportModel.find();

    const reportDtos: ReportDto[] = [];
    // Lấy thông tin từ Aip và gắn vào ReportDto
    for (const report of reports) {
      const aip = await this.aipModel.findOne({ _id: report.aip }).exec();

      const reportDto: ReportDto = {
        reportId: report._id,
        guardian: report.guardian,
        aip: report.aip,
        name: `${aip.firstName} ${aip.lastName}`, // Lấy firstName và lastName từ Aip
        date: report.date,
        summarization: report.summarization,
        healthStatusOfAip: report.healthStatusOfAip,
        supportRequest: report.supportRequest,
        note: report.note,
      };

      reportDtos.push(reportDto);
    }

    return reportDtos;
  }

  async findOne(reportId: string): Promise<ReportDto> {

    const report = await this.reportModel.findById(reportId);

    if (!report) {
      throw new NotFoundException(`report not found with id ${reportId}`);
    }

    const aip = await this.aipModel.findOne({ _id: report.aip }).exec();

    const reportDto: ReportDto = {
      reportId: report._id,
      guardian: report.guardian,
      aip: report.aip,
      name: `${aip.firstName} ${aip.lastName}`, // Lấy firstName và lastName từ Aip
      date: report.date,
      summarization: report.summarization,
      healthStatusOfAip: report.healthStatusOfAip,
      supportRequest: report.supportRequest,
      note: report.note,
    };

    return reportDto;
  }

  async findReportByGuardianId(guardianId: string): Promise<ReportDto[]> {

    console.log('GuardianId in ObjectId format:', guardianId);

    const reports = await this.reportModel.find({ guardian: guardianId });

    const reportDtos: ReportDto[] = [];
    // Lấy thông tin từ Aip và gắn vào ReportDto
    for (const report of reports) {
      const aip = await this.aipModel.findOne({ _id: report.aip }).exec();

      const reportDto: ReportDto = {
        reportId: report._id,
        guardian: report.guardian,
        aip: report.aip,
        name: `${aip.firstName} ${aip.lastName}`, // Lấy firstName và lastName từ Aip
        date: report.date,
        summarization: report.summarization,
        healthStatusOfAip: report.healthStatusOfAip,
        supportRequest: report.supportRequest,
        note: report.note,
      };

      reportDtos.push(reportDto);
    }

    return reportDtos;
  }

  async findReportByGuardianIdAndDate(guardianId: string, date: string): Promise<ReportDto[]> {

    const reports = await this.reportModel.find({ guardian: guardianId, date: date });

    const reportDtos: ReportDto[] = [];
    // Lấy thông tin từ Aip và gắn vào ReportDto
    for (const report of reports) {
      const aip = await this.aipModel.findOne({ _id: report.aip }).exec();

      const reportDto: ReportDto = {
        reportId: report._id,
        guardian: report.guardian,
        aip: report.aip,
        name: `${aip.firstName} ${aip.lastName}`, // Lấy firstName và lastName từ Aip
        date: report.date,
        summarization: report.summarization,
        healthStatusOfAip: report.healthStatusOfAip,
        supportRequest: report.supportRequest,
        note: report.note,
      };

      reportDtos.push(reportDto);
    }

    return reportDtos;
  }

  async update(reportId: string, updateReportDto: UpdateReportDto): Promise<Report> {

    const report = await this.reportModel.findById(reportId);

    if (!report) {
      throw new NotFoundException(`report not found with id ${reportId}`);
    }

    const updated = await this.reportModel.findByIdAndUpdate(reportId, updateReportDto, { new: true });

    return updated
  }

  async remove(reportId: string): Promise<void> {

    const report = await this.reportModel.findById(reportId);

    if (!report) {
      throw new NotFoundException(`report not found with id ${reportId}`);
    }

    return await this.reportModel.findByIdAndDelete(reportId);
  }
}
