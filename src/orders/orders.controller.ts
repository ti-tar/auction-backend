import { Controller, Get, Put, Post, Param, ParseIntPipe, UseGuards, UseInterceptors, Body } from '@nestjs/common';
import { Order } from '../entities/order';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';
import { ValidationPipe } from '../pipes/validation.pipe';
import { OrderValidationPipe } from '../pipes/order.validation.pipe';
import { OrderDto } from './dto/order.dto';
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
  async orders(@UserDecorator() user): Promise<Order[]> {
    return this.ordersService.findOwnLotsOrders(user.id);
  }

  @UseInterceptors(OrderSerializerInterceptor)
  @UseGuards(AuthGuard('jwt'))
  @Get(':orderId')
  async order(@Param('orderId', new ParseIntPipe()) orderId: number): Promise<Order> {
    return this.ordersService.findOne(orderId);
  }

  @UseInterceptors(OrderSerializerInterceptor)
  @UseGuards(AuthGuard('jwt'))
  @Put(':orderId')
  async update(
    @Param('orderId', new ParseIntPipe()) orderId: number,
    @Body(new ValidationPipe(), new OrderValidationPipe()) orderData: OrderDto,
  ): Promise<Order> {
    return this.ordersService.findOne(orderId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':lotId')
  async create(
    @Param('lotId', new ParseIntPipe()) lotId: number,
    @UserDecorator() user,
  ) {

  }
}
