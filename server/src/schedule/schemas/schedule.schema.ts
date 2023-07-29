import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseScema } from 'mongoose';
import { Guardian } from '../../guardian/schemas/guardian.schema';

@Schema({
  timestamps: true,
})
export class Schedule {
  @Prop({ type: Date })
  startTime: Date;

  @Prop({ type: Date })
  endTime: Date;

  @Prop()
  isCycle: boolean;

  @Prop({ type: MongooseScema.Types.ObjectId, ref: 'Guardian' })
  guardian: Guardian;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
