import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Guardian } from '../../guardian/schemas/guardian.schema';
import { Aip } from '../../aip/schemas/aip.schema';
import { Image } from '../../image/schemas/image.schema';
import { Schedule } from '../../schedule/schemas/schedule.schema';

@Schema({
  timestamps: true,
})
export default class Task {
  @Prop()
  title: string;

  @Prop()
  detail: string;

  @Prop()
  isDone: boolean;

  // @Prop({type : Date})
  // startTime: Date

  @Prop({ type: Date })
  deadline: Date;

  @Prop()
  isCycle: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Guardian' })
  guardian: Guardian;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Aip' })
  aip: Aip;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Schedule' })
  schedule: Schedule;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Image' })
  image: Image;

  @Prop()
  note: string;

  @Prop()
  reason: string
}

export const TaskSchema = SchemaFactory.createForClass(Task);
