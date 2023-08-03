import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Aip } from '../../aip/schemas/aip.schema';
import { Guardian } from '../../guardian/schemas/guardian.schema';

@Schema({
  timestamps: true,
})
export class Feedback {
  @Prop()
  fullname: string;

  @Prop()
  phone: string;

  @Prop()
  relationship: string;

  @Prop()
  email: string;

  @Prop()
  satisfactionLevel: number;

  @Prop()
  comment: string;

  @Prop({ type: Date })
  workTime: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Guardian' })
  guardian: Guardian;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Aip' })
  aip: Aip;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback)
