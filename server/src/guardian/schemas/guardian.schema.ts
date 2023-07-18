import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


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
}

export const GuardianSchema = SchemaFactory.createForClass(Guardian)
