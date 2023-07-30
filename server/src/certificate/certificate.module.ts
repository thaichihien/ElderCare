import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CertificateController } from './certificate.controller';
import { CertificateService } from './certificate.service';
import { Certificate, CertificateSchema } from './schemas/certificate.schema';

// set up controller, provider tại đây
@Module({
  // set up model mongodb để sử dụng
  imports: [
    MongooseModule.forFeature([
      { name: Certificate.name, schema: CertificateSchema },
    ]),
  ],
  controllers: [CertificateController],
  providers: [CertificateService],
})
export class CertificateModule {}
