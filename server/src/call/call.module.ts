import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Call, CallSchema } from './schemas/call.schema';
import { CallController } from './call.controller';
import { CallService } from './call.service';
import { Guardian, GuardianSchema } from 'src/guardian/schemas/guardian.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Call.name, schema: CallSchema },
        ]),
        MongooseModule.forFeature([
            { name: Guardian.name, schema: GuardianSchema },
        ]),
    ],
    controllers: [CallController],
    providers: [CallService]
})
export class CallModule { }