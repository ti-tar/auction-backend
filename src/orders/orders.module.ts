import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order';

@Module({
  imports: [TypeOrmModule.forFeature([ Order ])],
  providers: [ OrdersService ],
})

export class OrdersModule {}
