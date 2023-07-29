import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Schema as MongooseSchema } from 'mongoose';
import { Image } from 'src/image/schemas/image.schema';
import { Aip } from '../../aip/schemas/aip.schema';
import { Guardian } from '../../guardian/schemas/guardian.schema';

@Schema({
  timestamps: true,
})
export class Task {
  @Prop()
  title: string;

  @Prop()
  detail: string;

  @Prop()
  isDone: boolean;

  @Prop({ type: Date })
  startTime: Date;

  @Prop({ type: Date })
  endTime: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Guardian' })
  guardian: Guardian;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Aip' })
  aip: Aip;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'TaskImage' })
  image: Image;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
