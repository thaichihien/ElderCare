import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Qualification {

  // TODO định nghĩa các property cần thiết như tên, loại bằng cấp, link ảnh,... trong này




}

export const QualificationSchema = SchemaFactory.createForClass(Qualification);
