import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseScema } from 'mongoose';
import { Guardian } from '../../guardian/schemas/guardian.schema';
import { Aip } from 'src/aip/schemas/aip.schema';
import { Schedule } from 'src/schedule/schemas/schedule.schema';

@Schema ({
    timestamps: true,
})
export class Report {

    @Prop({ type: MongooseScema.Types.ObjectId, ref: 'Guardian' })
    guardian: Guardian;

    @Prop({ type: MongooseScema.Types.ObjectId, ref: 'Aip' })
    aip: Aip;

    @Prop()
    date: string

    @Prop()
    summarization: string;

    @Prop()
    healthStatusOfAip: string;

    @Prop()
    supportRequest: string;

    @Prop()
    note: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);