import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@Schema({
  timestamps: true,
})
export class Certification {
  // TODO định nghĩa các property cần thiết như tên, loại bằng cấp, link ảnh,... trong này
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  image: string;
}

export const CertificationSchema = SchemaFactory.createForClass(Certification);
