import { Injectable } from '@nestjs/common';
import { LoggerService } from '../shared/logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    private readonly loggerService: LoggerService,
  ) {}

  async create(): Promise<Order> {
    const newOrder = new Order();
    newOrder.arrivalLocation = 'test address';
    newOrder.type = 'Royal Mail';
    newOrder.status = 'pending';

    this.loggerService.log(`New Order Created! Arrival Location: ${newOrder.arrivalLocation}`);

    return await this.ordersRepository.save(newOrder);
  }
}
