import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseScema } from 'mongoose';
import { Guardian } from '../../guardian/schemas/guardian.schema';

@Schema({ _id: false })
export class Coordinates extends Document {
  @Prop()
  lat: number;

  @Prop()
  long: number;
}
export const CoordinatesSchema = SchemaFactory.createForClass(Coordinates);

// Định nghĩa bảng dữ liệu trong mongoDB
@Schema({
  timestamps: true,
})
export class Aip {
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
  @Prop({ type: CoordinatesSchema })
  coordinates: Coordinates;
  @Prop()
  healthStatus: string;
  @Prop()
  note: string;

  @Prop({ type: MongooseScema.Types.ObjectId, ref: 'Guardian' })
  guardian: Guardian;
}

export const AipSchema = SchemaFactory.createForClass(Aip);
