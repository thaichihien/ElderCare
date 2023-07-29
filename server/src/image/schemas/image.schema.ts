import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

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
}

export const ImageSchema = SchemaFactory.createForClass(Image);
