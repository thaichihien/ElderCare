import { Module } from '@nestjs/common';
import { AipService } from './aip.service';
import { AipController } from './aip.controller';
import { Aip, AipSchema } from './schemas/aip.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Aip.name, schema: AipSchema },
    ]),
  ],
  providers: [AipService],
  controllers: [AipController]
})
export class AipModule {}
