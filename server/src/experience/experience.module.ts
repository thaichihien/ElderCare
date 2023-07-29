import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExperienceController } from './experience.controller';
import { ExperienceService } from './experience.service';
import { Experience, ExperienceSchema } from './schemas/experience.schema';

// set up controller, provider tại đây
@Module({
  // set up model mongodb để sử dụng
  imports: [
    MongooseModule.forFeature([
      { name: Experience.name, schema: ExperienceSchema },
    ]),
  ],
  controllers: [ExperienceController],
  providers: [ExperienceService],
})
export class ExperienceModule {}
