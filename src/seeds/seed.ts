import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { LoggerService } from '../shared/logger.service';
import { SeederService } from './seeder.service';
import { TestUtilsService } from '../shared/test-utils.service';

async function bootstrap() {

  const appContext = await NestFactory.createApplicationContext(SeederModule);
  const loggerService = appContext.get(LoggerService);
  const seederService = appContext.get(SeederService);
  const testUtilsService = appContext.get(TestUtilsService);

  loggerService.log('Clear tables in database...');
  await testUtilsService.reloadDatabase();

  loggerService.log('Seeding...');
  await seederService.seed();

  await appContext.close();

}

bootstrap();
