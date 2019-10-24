import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order';
import { LoggerService } from '../shared/logger.service';
import { OrderDto } from './dto/order.dto';
import { User } from '../entities/user';
import { LotsService } from '../lots/lots.service';


@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    private readonly loggerService: LoggerService,
    private readonly lotsService: LotsService,
  ) {}

  async create(lotId: number, orderDto: OrderDto, user: User): Promise<any> {
    const lot = await this.lotsService.findOne(lotId);

    // check if winner
    if (lot.status !== 'closed' || !lot.bids.length ) {
      throw new BadRequestException('You are not winner of lot');
    }

    //

    // const lastBidUser = await this.bidsService.findOne(lot.bids[lot.bids.length - 1].id);
    //
    // if (!lastBidUser || lastBidUser.user.id !== user.id ) {
    //   throw new BadRequestException('You are not winner of lot');
    // }

    // const newOrder = new Order();
    // newOrder.arrivalLocation = 'pending';
    // newOrder.type = 'pending';
    // newOrder.status = 'pending';
    // newOrder.bid = bid;
    return ''; // 'this.ordersRepository.save(newOrder)';
  }

  async update(lotId: number, orderDto: OrderDto, user: User): Promise<any> {

    // const newOrder = new Order();
    // newOrder.arrivalLocation = 'pending';
    // newOrder.type = 'pending';
    // newOrder.status = 'pending';
    // newOrder.bid = bid;
    return ''; // 'this.ordersRepository.save(newOrder)';
  }

  async findOne(orderId): Promise < Order > {
    return this.ordersRepository.findOne(orderId, {
      relations: ['bid'],
    });
  }

  async findOwnLotsOrders(userId: number): Promise < Order[] > {
    return this.ordersRepository.find(); // todo
  }
}
