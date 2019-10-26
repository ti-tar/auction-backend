import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order';
import { LoggerService } from '../shared/logger.service';
import { OrderDto } from './dto/order.dto';
import { User } from '../entities/user';
import { LotsService } from '../lots/lots.service';
import { ModuleRef } from '@nestjs/core';
import { BidsService } from '../bids/bids.service';

@Injectable()
export class OrdersService implements OnModuleInit {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    private readonly loggerService: LoggerService,
    private readonly lotsService: LotsService,
    private readonly moduleRef: ModuleRef,
  ) {}

  private bidsService: BidsService;

  onModuleInit(): any {
    this.bidsService = this.moduleRef.get('BidsService', { strict: false });
  }

  async create(lotId: number, orderDto: OrderDto, user: User): Promise<Order> {
    const lot = await this.lotsService.findOne(lotId);

    // check if winner
    if (lot.status !== 'closed' || !lot.bids.length ) {
      throw new BadRequestException('You are not winner of lot');
    }

    const winnerBid = await this.bidsService.findOne(lot.bids[lot.bids.length - 1].id);

    if (!winnerBid || winnerBid.user.id !== user.id ) {
      throw new BadRequestException('You are not winner of lot');
    }

    const newOrder = new Order();
    newOrder.arrivalLocation = orderDto.arrivalLocation;
    newOrder.type = orderDto.type;
    newOrder.status = 'pending';
    newOrder.bid = winnerBid;

    return await this.ordersRepository.save(newOrder);
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
