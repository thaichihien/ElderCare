import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageModule } from 'src/image/image.module';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { Schedule, ScheduleSchema } from 'src/schedule/schemas/schedule.schema';
import Task, { TaskSchema } from './schemas/task.schema';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Aip, AipSchema } from '../aip/schemas/aip.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: Schedule.name, schema: ScheduleSchema },
      { name: Aip.name, schema: AipSchema },
    ]),

    ImageModule,
    //ScheduleModule
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
