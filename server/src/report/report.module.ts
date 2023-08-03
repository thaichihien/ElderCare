import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { Aip, AipSchema } from 'src/aip/schemas/aip.schema';
import { Guardian, GuardianSchema } from 'src/guardian/schemas/guardian.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from './schemas/report.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Report.name, schema: ReportSchema },
      { name: Guardian.name, schema: GuardianSchema },
      { name: Aip.name, schema: AipSchema },
    ]),
  ],
  controllers: [ReportController],
  providers: [ReportService]
})
export class ReportModule {}
