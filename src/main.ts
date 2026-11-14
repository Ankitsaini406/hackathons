import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/http-exception.filter.js';
import { TransformInterceptor } from './utils/transform.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  app.enableShutdownHooks();

  const port = process.env.PORT ?? 5000;

  await app.listen(port);
  console.log(`Server running at http://localhost:${port}`);
}

bootstrap();
