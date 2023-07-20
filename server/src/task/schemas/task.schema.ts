import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Schema as MongooseScema } from 'mongoose';
import { Guardian } from '../../guardian/schemas/guardian.schema';
import { Aip } from '../../aip/schemas/aip.schema';
import { TaskImage } from 'src/image/schemas/image.schemas';

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

  @Prop({type : Date})
  startTime: Date

  @Prop({type :Date})
  endTime: Date


  @Prop({ type: MongooseScema.Types.ObjectId, ref: 'Guardian' })
  guardian: Guardian;

  @Prop({ type: MongooseScema.Types.ObjectId, ref: 'Aip' })
  aip: Aip;

  @Prop({ type: MongooseScema.Types.ObjectId, ref: 'TaskImage' })
  image: TaskImage;
  
  
}

export const TaskSchema = SchemaFactory.createForClass(Task);