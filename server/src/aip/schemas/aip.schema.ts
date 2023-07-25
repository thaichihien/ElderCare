import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseScema } from 'mongoose';
import { Guardian } from '../../guardian/schemas/guardian.schema';

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
    @Prop()
    healthStatus: string;
    @Prop()
    note: string;

    @Prop({ type: MongooseScema.Types.ObjectId, ref: 'Guardian' })
    guardian: Guardian;

}

export const AipSchema = SchemaFactory.createForClass(Aip)
