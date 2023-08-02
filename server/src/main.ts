import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 3000;
const host = '0.0.0.0';

async function bootstrap() {

  const connectDB = async () => {
    try {
      const connectstring = process.env.DB_URI
      console.log(connectstring);
      const conn = await mongoose.connect(connectstring);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };

  await connectDB()

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Eldercare API')
    .setDescription('The elder care API description')
    .setVersion('1.0')
    .addTag('Authentication')
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('doc', app, document);

  

  await app.listen(PORT, host);
  console.log(`server is ready at http://localhost:${PORT}`);
}
bootstrap();
