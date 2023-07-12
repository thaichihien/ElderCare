import { Module } from '@nestjs/common';
import { AipService } from './aip.service';
import { AipController } from './aip.controller';

@Module({
  providers: [AipService],
  controllers: [AipController]
})
export class AipModule {}
