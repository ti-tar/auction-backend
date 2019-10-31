import { Controller, Get, Param, ParseIntPipe, UseGuards, UseInterceptors, Query } from '@nestjs/common';
import { Order } from '../entities/order';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';
import { OrdersSerializerInterceptor } from './serializers/orders.interceptor';
import { OrderSerializerInterceptor } from './serializers/order.interceptor';
import { UserDecorator } from '../users/user.decorator';

@Controller('orders')
export class OrdersController {

  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @UseInterceptors(OrdersSerializerInterceptor)
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async orders(@UserDecorator() user, @Query() query): Promise<Order[]> {
    return this.ordersService.findOrders(user.id, query);
  }

  @UseInterceptors(OrderSerializerInterceptor)
  @UseGuards(AuthGuard('jwt'))
  @Get(':orderId')
  async order(@Param('orderId', new ParseIntPipe()) orderId: number): Promise<Order> {
    return this.ordersService.findOne(orderId);
  }
}
