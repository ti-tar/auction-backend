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
import { getWinnersBid } from '../libs/helpers';

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
    if (lot.status !== 'closed' || !lot.bids.length || getWinnersBid(lot.bids).user.id !== user.id ) {
      throw new BadRequestException('You are not winner of lot');
    }

    const winnersBid = getWinnersBid(lot.bids);

    const newOrder = await this.ordersRepository.save({
      arrivalLocation: orderDto.arrivalLocation,
      type: orderDto.type,
      status: 'pending',
      bid: winnersBid,
    });

    await this.bidsService.update(winnersBid.id, { order: newOrder });
    return newOrder;
  }

  async update(lotId: number, orderDto: OrderDto, user: User): Promise<Order> {
    const lot = await this.lotsService.findOne(lotId);

    if (lot.status !== 'closed' || !lot.bids.length) {
      throw new BadRequestException('Error! Bad lot format');
    }

    const order = getWinnersBid(lot.bids).order;
    if (!order) {
      throw new BadRequestException('Error! Bad lot format');
    }
    await this.ordersRepository.update(order.id, {
      arrivalLocation: orderDto.arrivalLocation,
      type: orderDto.type,
    });
    return await this.ordersRepository.findOne(order.id);
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
