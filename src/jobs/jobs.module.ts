import { Module } from '@nestjs/common';
import { BullModule } from 'nest-bull';
import { ConfigService } from '../shared/config.service';
import { QUEUE_NAMES } from './jobsList';
import { LotsJobs } from './lots.jobs';
import { EmailsJobs } from '../emails/emails.jobs';

@Module({
  imports: [
    BullModule.registerAsync([
      {
        name: QUEUE_NAMES.LOTS,
        useFactory: async (configService: ConfigService) => ({
          options: {
            prefix: 'lots',
            redis: configService.config.configRedis,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: QUEUE_NAMES.EMAILS,
        useFactory: async (configService: ConfigService) => ({
          options: {
            prefix: 'emails',
            redis: configService.config.configRedis,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    LotsJobs, EmailsJobs,
  ],
  exports: [BullModule],
})
export class JobsModule {}
