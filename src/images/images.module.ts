import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { LoggerService } from '../shared/logger.service';
import { ConfigService } from '../shared/config.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [ SharedModule ],
  providers: [ImagesService, LoggerService, ConfigService],
})
export class ImagesModule {}
