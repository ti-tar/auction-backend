import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { LotsController } from './lots.controller';
import { Lot } from '../entities/lot';
import { User } from '../entities/user';
import { Bid } from '../entities/bid';
import { LotsService } from './lots.service';
import { UsersService } from '../users/users.service';
import { LotsGateway } from './lots.gateway';
import { OrdersService } from '../orders/orders.service';
import { Order } from '../entities/order';
import { ImagesService } from '../images/images.service';
import { JobsModule } from '../jobs/jobs.module';
import { BidsModule } from '../bids/bids.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lot, User, Bid, Order]),
    PassportModule,
    JobsModule,
    BidsModule,
  ],
  providers: [
    LotsService, UsersService,
    LotsGateway, OrdersService,
    ImagesService,
  ],
  controllers: [LotsController],
  exports: [LotsService, TypeOrmModule, LotsGateway],
})
export class LotsModule {}
