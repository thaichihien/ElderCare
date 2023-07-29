import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Certification {
  @Prop()
  title: string;
  @Prop()
  description: string;
  @Prop()
  image: any;
}

export const CertificationSchema = SchemaFactory.createForClass(Certification);
