import { Module } from '@nestjs/common';
import { BullModule } from 'nest-bull';
import { ConfigService } from '../shared/config.service';
import { QUEUE_NAMES } from './jobsList';
import { LotsJobs } from './lots.jobs';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    BullModule.registerAsync({
      name: QUEUE_NAMES.LOTS,
      useFactory: async (configService: ConfigService) => ({
        options: {
          redis: configService.config.configRedis,
        },
      }),
      inject: [ConfigService],
    }),
    SharedModule,
  ],
  providers: [
    LotsJobs,
  ],
  exports: [BullModule],
})
export class JobsModule {}
