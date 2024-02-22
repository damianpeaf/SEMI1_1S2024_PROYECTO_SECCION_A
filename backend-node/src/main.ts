import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  });

  await app.listen(process.env.PORT || 3000);
  logger.log(`Application listening on port ${process.env.PORT || 3000}, NODE_ENV: ${process.env.NODE_ENV}`);
}
bootstrap();
