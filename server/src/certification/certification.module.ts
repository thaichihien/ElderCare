import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CertificationController } from './certification.controller';
import {
  Certification,
  CertificationSchema,
} from './schemas/certification.schema';
import { CertificationService } from './certification.service';

// set up controller, provider tại đây
@Module({
  // set up model mongodb để sử dụng
  imports: [
    MongooseModule.forFeature([
      { name: Certification.name, schema: CertificationSchema },
    ]),
  ],
  controllers: [CertificationController],
  providers: [CertificationService],
})
export class CertificationModule {}
