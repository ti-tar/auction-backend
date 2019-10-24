import { Module } from '@nestjs/common';
import { BullModule } from 'nest-bull';
import { ConfigService } from '../shared/config.service';
import { QUEUE_NAMES } from './jobsList';
import { LotsJobs } from './lots.jobs';
import { EmailsJobs } from '../emails/emails.jobs';
import { LotsService } from '../lots/lots.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lot } from '../entities/lot';
import { User } from '../entities/user';
import { Bid } from '../entities/bid';
import { Order } from '../entities/order';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';
import { BidsService } from '../bids/bids.service';
import { LotsGateway } from '../lots/lots.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lot, User, Bid, Order]),
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
    LotsJobs, EmailsJobs, LotsService, OrdersService, UsersService, BidsService, LotsGateway,
  ],
  exports: [BullModule],
})
export class JobsModule {}
