import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lot } from '../entities/lot';
import { User } from '../entities/user';
import { Bid } from '../entities/bid';
import { Order } from '../entities/order';
import { BidsService } from './bids.service';
import { JobsModule } from '../jobs/jobs.module';
import { OrdersModule } from '../orders/orders.module';
import { LotsGateway } from '../lots/lots.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lot, User, Bid, Order]),
    JobsModule,
    OrdersModule,
  ],
  providers: [BidsService, LotsGateway],
  exports: [BidsService],
})
export class BidsModule {}
