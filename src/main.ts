import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as helmet from 'helmet';
import { join } from 'path';
import { NestExpressApplication, ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  );

  // app.useStaticAssets(join(__dirname, '..', 'upload'));
  app.useStaticAssets(
    join(__dirname, '..', 'upload'),
  );

  // app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');

  await app.listen(5000);
}

bootstrap();
