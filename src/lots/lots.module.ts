import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import * as Redis from 'ioredis';
import { LotsController } from './lots.controller';
import { Lot } from '../entities/lot';
import { User } from '../entities/user';
import { Bid } from '../entities/bid';
import { LotsService } from './lots.service';
import { UsersService } from '../users/users.service';
import { BidsService } from '../bids/bids.service';
import { LoggerService } from '../shared/logger.service';
import { ConfigService } from '../shared/config.service';
import { LotsGateway } from './lots.gateway';
import { OrdersService } from '../orders/orders.service';
import { Order } from '../entities/order';
import { BullModule } from 'nest-bull';
import { LotJobsService, lotQueueName } from './lot-jobs.service';
import { ImagesService } from '../images/images.service';

const configRedis: Redis.RedisOptions = {
  host: 'localhost',
  port: 6379,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([Lot, User, Bid, Order]),
    PassportModule,
    BullModule.register({
      name: lotQueueName,
      options: {
        redis: configRedis,
      },
    }),
  ],
  providers: [
    LotsService, UsersService, BidsService,
    LoggerService, ConfigService,
    LotsGateway, OrdersService,
    LotJobsService, ImagesService,
  ],
  controllers: [LotsController],
})
export class LotsModule {}
