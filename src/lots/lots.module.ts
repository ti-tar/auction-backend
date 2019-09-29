import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { LotsController } from './lots.controller';
import { Lot } from '../entities/lot';
import { User } from '../entities/user';
import { Bid } from '../entities/bid';
import { LotsService } from './lots.service';
import { UsersService } from '../users/users.service';
import { BidsService } from '../bids/bids.service';
import { LoggerService } from '../shared/logger.service';
import { ConfigService } from '../shared/config.service';
import { JwtModule } from '@nestjs/jwt';
import { SECRET } from '../config';
import { LotsGateway } from './lots.gateway';
import { OrdersService } from '../orders/orders.service';
import { Order } from '../entities/order';
import { BullModule, InjectQueue } from 'nest-bull';
import { DoneCallback, Job, Queue } from 'bull';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lot, User, Bid, Order]),
    PassportModule,
    JwtModule.register({ secretOrPrivateKey: SECRET }),
    BullModule.forRoot({
      name: 'store',
      options: {
        redis: {
          port: 6379,
        },
      },
      processors: [{
        name: 'lot_job_name_1',
        callback: async (job) => {
          return await `${job.id}. Yeah!`;
        },
      }],
    }),
  ],
  providers: [
    LotsService, UsersService, BidsService, LoggerService, ConfigService, LotsGateway, OrdersService,
  ],
  controllers: [LotsController],
})
export class LotsModule implements OnModuleInit {
  constructor(
    @InjectQueue('store') readonly queue: Queue,
    readonly loggerService: LoggerService,
  ) {}

  onModuleInit() {
    this.queue.add('lot_job_name_1', { someKey: 'someValue' }, {
      repeat: { cron: '* * * * *', tz: 'Europe/Kiev' },
      removeOnFail: false,
    }).then(job => {
      this.loggerService.log(`This job ${job.name} starts every minute`);
    });

    this.queue.on('completed', (job, result) => {
      this.loggerService.log(`Job ${job.name} completed! Result: ${result}`);
    });

    this.queue.on('failed', (job, err) => {
      this.loggerService.error(err);
    });
  }
}
