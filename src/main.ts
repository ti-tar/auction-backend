import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { join } from 'path';
import { NestExpressApplication, ExpressAdapter } from '@nestjs/platform-express';
import { LoggerService } from './shared/logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      cors: true,
      logger: new LoggerService(),
    },
  );

  app.useStaticAssets(
    join(__dirname, '..', 'upload'),
  );

  app.use(helmet());

  app.setGlobalPrefix('api');

  await app.listen(5000);
}

bootstrap();
