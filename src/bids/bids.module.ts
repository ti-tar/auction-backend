import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lot } from '../entities/lot';
import { User } from '../entities/user';
import { Bid } from '../entities/bid';
import { Order } from '../entities/order';
import { BidsService } from './bids.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lot, User, Bid, Order]),
  ],
  providers: [    BidsService  ],
  exports: [BidsService, TypeOrmModule],
})
export class BidsModule {}
