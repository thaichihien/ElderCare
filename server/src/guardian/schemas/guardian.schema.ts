import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Certificate } from '../../certificate/schemas/certificate.schema';
import { Experience } from '../../experience/schemas/experience.schema';
import { Schema as MongooseSchema } from 'mongoose';

enum Level {
  Amateur,
  Professional,
}

// Định nghĩa bảng dữ liệu trong mongoDB
@Schema({
  timestamps: true,
})
export class Guardian {
  @Prop()
  firstName: string;
  @Prop()
  lastName: string;
  @Prop()
  CCCD: string;
  @Prop()
  phoneNumber: string;
  @Prop()
  dateOfBirth: string;
  @Prop()
  address: string;

  @Prop({ type: String, enum: Level, default: Level.Amateur })
  level: Level;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Certificate' })
  certificates: Certificate[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Experience' })
  experiences: Experience[];
}

export const GuardianSchema = SchemaFactory.createForClass(Guardian);
