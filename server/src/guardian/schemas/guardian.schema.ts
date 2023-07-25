import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Certification, CertificationSchema } from './certification.schema';
import { Experience, ExperienceSchema } from './experience.schema';

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

  @Prop({ type: [CertificationSchema] })
  qualifications: Certification[];

  @Prop({ type: [ExperienceSchema] })
  experiences: Experience[];
}

export const GuardianSchema = SchemaFactory.createForClass(Guardian);
