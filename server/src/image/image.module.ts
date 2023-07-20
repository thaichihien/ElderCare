import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskImage, TaskImageShema } from './schemas/image.schemas';

@Module({
    imports:[MongooseModule.forFeature([{ name: TaskImage.name, schema: TaskImageShema }]),HttpModule],
    providers : [ImageService],
    exports : [ImageService]
})
export class ImageModule {}
