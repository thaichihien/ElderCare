import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import Task from '../../task/schemas/task.schema';

@Schema({
  timestamps: true,
})
export class Image {
  @Prop()
  link: string;

  @Prop()
  latitude: number;

  @Prop()
  longitude: number;

  @Prop()
  address: string;

  @Prop({ type: Date })
  time: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Task' })
  task: Task;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
