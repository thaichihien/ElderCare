import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Certificate {
  @Prop()
  title: string;
  @Prop()
  description: string;
  @Prop()
  image: string;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);
