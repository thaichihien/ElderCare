import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosError } from 'axios';
import Exif, { ExifImage } from 'exif';
import mongoose from 'mongoose';
import { catchError, firstValueFrom } from 'rxjs';

import * as FormData from 'form-data';
import { CreateImageDto } from './dto/create-image.dto';
import { Image } from './schemas/image.schema';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image.name)
    private imageModel: mongoose.Model<Image>,
    private readonly httpService: HttpService,
  ) {}

  async getExifData(file: Express.Multer.File): Promise<Exif.ExifData> {
    return new Promise((resolve, reject) => {
      try {
        new ExifImage(file.buffer, async (error, edata: Exif.ExifData) => {
          if (error) {
            console.log('getExifData ' + error);
            throw new BadRequestException(error)
            reject(error);
          }
          console.log(edata);
          resolve(edata);
        });
      } catch (error) {
        console.log('getExifData ' + error)
        throw new BadRequestException(error);
      }
    });
  }

  async saveImageToCloud(file: Express.Multer.File) {

    const formData = new FormData();
    formData.append('image', file.buffer.toString('base64'));
    const { data: imageData } = await firstValueFrom(
      this.httpService
        .post(
          `https://api.imgbb.com/1/upload?key=${process.env.IMAGE_KEY}`,
          formData,
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw new InternalServerErrorException("save image to cloud server error : " + error);
          }),
        ),
    );

    return imageData.data.url;
  }

  async saveImageToDatabase(createImageDto: CreateImageDto) {
    const img = await this.imageModel.create(createImageDto);

    return img;
  }

  convertDMSToDD(dms: number[], direction: string): number {
    const degrees = dms[0];
    const minutes = dms[1];
    const seconds = dms[2];

    let dd = degrees + minutes / 60 + seconds / (60 * 60);

    if (direction == 'S' || direction == 'W') {
      dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
  }

  async getAddressStringFrom(latitude: number, longitude: number) {
    const { data: ggData } = await firstValueFrom(
      this.httpService
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&language=vi&key=${process.env.GOOGLE_KEY}`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw new InternalServerErrorException(
              'get address server error : ' + error,
            );
          }),
        ),
    );

    //console.log(ggData)

    console.log(ggData);
    if (ggData.results.length <= 0) {
      return '';
    }

    return ggData.results[0].formatted_address;
  }
}
