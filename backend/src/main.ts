import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { apiPort } from './config/env';
import { ValidationPipe } from '@nestjs/common';
import { ErrorFilter } from './exceptions/error.filter';
import { setupSwaggerDocs } from './config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new ErrorFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await setupSwaggerDocs(app);
  await app.listen(apiPort);
}

bootstrap();
