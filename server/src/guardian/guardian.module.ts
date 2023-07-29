import { Module } from '@nestjs/common';
import { GuardianController } from './guardian.controller';
import { GuardianService } from './guardian.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Guardian, GuardianSchema } from './schemas/guardian.schema';
import { Experience, ExperienceSchema } from './schemas/experience.schema';
import {
  Certification,
  CertificationSchema,
} from './schemas/certification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Guardian.name, schema: GuardianSchema },
      { name: Experience.name, schema: ExperienceSchema },
      { name: Certification.name, schema: CertificationSchema },
    ]),
  ],
  controllers: [GuardianController],
  providers: [GuardianService],
})
export class GuardianModule {}
