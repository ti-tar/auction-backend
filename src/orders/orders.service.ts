import { Injectable } from '@nestjs/common';
import { LoggerService } from '../shared/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order';
import { CreateOrderDto } from './dto/create-lot.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    private readonly loggerService: LoggerService,
  ) {}

  async create(orderData: CreateOrderDto): Promise<Order> {
    const newOrder = new Order();
    newOrder.arrivalLocation = orderData.arrivalLocation;
    newOrder.type = orderData.type;
    newOrder.status = orderData.status;

    this.loggerService.log(`New Order Created! Arrival Location: ${newOrder.arrivalLocation}`);

    return await this.ordersRepository.save(newOrder);
  }
}
