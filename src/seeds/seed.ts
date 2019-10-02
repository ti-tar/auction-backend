import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { LoggerService } from '../shared/logger.service';
import { SeederService } from './seeder.service';

async function bootstrap() {
  NestFactory
    .createApplicationContext(SeederModule)
    .then(appContext => {
      const loggerService = appContext.get(LoggerService);
      const seederService = appContext.get(SeederService);
      seederService.seed().finally(() => appContext.close());
    }).catch(error => {
      throw error;
    });
}

bootstrap();
