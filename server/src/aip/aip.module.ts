import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import Task, { TaskSchema } from 'src/task/schemas/task.schema';
import { AipController } from './aip.controller';
import { AipService } from './aip.service';
import { Aip, AipSchema } from './schemas/aip.schema';
import { Guardian, GuardianSchema } from '../guardian/schemas/guardian.schema';
import { Report, ReportSchema } from 'src/report/schemas/report.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Aip.name, schema: AipSchema },
      { name: Task.name, schema: TaskSchema },
      { name: Guardian.name, schema: GuardianSchema },
      { name: Report.name, schema: ReportSchema },
    ]),
  ],
  providers: [AipService],
  controllers: [AipController],
})
export class AipModule { }
