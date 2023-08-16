import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseScema } from 'mongoose';
import { Guardian } from '../../guardian/schemas/guardian.schema';

enum Reason {
    DeclinedCall,
    TimeOut,
    None = null
}

@Schema ({
    timestamps: true,
})
export class Call {

    @Prop({ type: MongooseScema.Types.ObjectId, ref: 'Guardian' })
    guardian: Guardian;

    @Prop({default: false})
    isSuccessful: boolean;

    @Prop({ type: String, enum: Reason, default: null })
    reason: Reason;
}

export const CallSchema = SchemaFactory.createForClass(Call);