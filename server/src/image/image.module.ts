import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageService } from './image.service';
import { Image, ImageSchema } from './schemas/image.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]), HttpModule],
    providers: [ImageService],
    exports: [ImageService]
})
export class ImageModule { }
