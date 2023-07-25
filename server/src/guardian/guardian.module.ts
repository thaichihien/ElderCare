import { Module } from '@nestjs/common';
import { GuardianController } from './guardian.controller';
import { GuardianService } from './guardian.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Guardian, GuardianSchema } from './schemas/guardian.schema';
import { Qualification, QualificationSchema } from './schemas/certification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Guardian.name, schema: GuardianSchema },
      { name: Qualification.name, schema: QualificationSchema }
    ]),
  ],
  controllers: [GuardianController],
  providers: [GuardianService]
})
export class GuardianModule {}
