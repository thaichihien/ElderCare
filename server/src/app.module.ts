import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TutorialModule } from './tutorial/tutorial.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GuardianModule } from './guardian/guardian.module';
import { AipModule } from './aip/aip.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { ImageService } from './image/image.service';
import { ImageModule } from './image/image.module';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from './schedule/schedule.module';
import { CertificateModule } from './certificate/certificate.module';
import { ExperienceModule } from './experience/experience.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    TutorialModule,
    GuardianModule,
    AipModule,
    AuthModule,
    ImageModule,
    TaskModule,
    ScheduleModule,
    CertificateModule,
    ExperienceModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
