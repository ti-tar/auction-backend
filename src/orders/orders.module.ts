import { Module } from '@nestjs/common';
import { LoggerService } from '../shared/logger.service';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order';

@Module({
  imports: [TypeOrmModule.forFeature([ Order ])],
  providers: [
    LoggerService,
    OrdersService,
  ],
})

export class OrdersModule {}
