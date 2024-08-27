import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule, new ExpressAdapter());

  const config = new DocumentBuilder()
    .setTitle('Airbnb API')
    .setDescription('API for Rental application')
    .setVersion('1.0')
    .addServer('http://localhost:3000/api', 'Local environment')
    .addServer('https://rental-2wuz.onrender.com/api', 'Production Server')
    .build();
  app.enableCors({ credentials: true });
  const document = SwaggerModule.createDocument(app, config);
  app.setGlobalPrefix('api');
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
