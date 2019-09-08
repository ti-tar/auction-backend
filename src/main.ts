import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as helmet from 'helmet';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    { cors: true },
  );

  app.useStaticAssets(join(__dirname, '..', 'upload'));
  app.setGlobalPrefix('api');

  await app.listen(5000);
}

bootstrap();
