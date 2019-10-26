import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order';
import { OrdersController } from './orders.controller';
import { Lot } from '../entities/lot';
import { LotsModule } from '../lots/lots.module';

@Module({
  imports: [
    forwardRef(() => LotsModule),
    TypeOrmModule.forFeature([ Order, Lot ]),
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})

export class OrdersModule {}
