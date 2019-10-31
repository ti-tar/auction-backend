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
import { Lot } from '../entities/lot';

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

    if (lot.status !== 'closed' || !lot.bids.length || getWinnersBid(lot.bids).user.id !== user.id) {
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

  async executeOrder(lotId: number, user: User): Promise<Lot> {
    const lot = await this.lotsService.findOne(lotId);

    // if user is owner lot
    if (!lot || lot.user.id !== user.id) {
      throw new BadRequestException('You are not the owner!');
    }

    // if order does not exist
    const winnersBid = getWinnersBid(lot.bids || []);
    if (!winnersBid || !winnersBid.order || !winnersBid.order.id ) {
      throw new BadRequestException('Lots has no order yet!');
    }

    // if order does not have status pending
    if (winnersBid.order.status !== 'pending') {
      throw new BadRequestException('Order does not have pending status. Maybe, Lot already sent');
    }

    await this.ordersRepository.update(winnersBid.order.id, { status: 'sent'});

    return await this.lotsService.findOne(lotId);
  }

  async receiveOrder(lotId: number, user: User): Promise<Lot> {
    const lot = await this.lotsService.findOne(lotId);

    // if user is owner lot
    if (!lot) {
      throw new BadRequestException('Not such lot!');
    }

    // lot.user.id !== user.id

    // if order does not exist
    const winnersBid = getWinnersBid(lot.bids || []);

    if (!winnersBid || winnersBid.user.id !== user.id) {
      throw new BadRequestException('You are not the owner!');
    }

    if (!winnersBid || !winnersBid.order || !winnersBid.order.id) {
      throw new BadRequestException('Lots has no order yet!');
    }

    // if order does not have status pending
    if (winnersBid.order.status !== 'sent') {
      throw new BadRequestException('Order has not been sent');
    }

    await this.ordersRepository.update(winnersBid.order.id, { status: 'delivered'});

    return await this.lotsService.findOne(lotId);
  }

  async findOne(orderId): Promise < Order > {
    return this.ordersRepository.findOne(orderId, {
      relations: ['bid'],
    });
  }

  async findOrders(userId: number, query): Promise <Order[]> {
    if (query.filters && query.filters === 'mylots') {
      return await this.ordersRepository.createQueryBuilder('orders')
        .leftJoinAndSelect('orders.bid', 'bids')
        .leftJoinAndSelect('bids.user', 'users')
        .leftJoinAndSelect('bids.lot', 'bids_lot')
        .leftJoinAndSelect('bids_lot.user', 'bids_lot_user')
        .where('bids_lot_user.id = :id', { id: userId })
        .getMany();
    }

    return await this.ordersRepository.createQueryBuilder('orders')
      .leftJoinAndSelect('orders.bid', 'bids')
      .leftJoinAndSelect('bids.lot', 'lots')
      .leftJoinAndSelect('bids.user', 'bids_user')
      .where('bids_user.id = :id', { id: userId })
      .getMany();
  }
}
