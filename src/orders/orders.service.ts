import { BadRequestException, Injectable, OnModuleInit, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../entities/order';
import { LoggerService } from '../shared/logger.service';
import { OrderDto } from './dto/order.dto';
import { User } from '../entities/user';
import { LotsService } from '../lots/lots.service';
import { ModuleRef } from '@nestjs/core';
import { BidsService } from '../bids/bids.service';
import { getWinnersBid } from '../libs/helpers';
import { Lot, LotStatus } from '../entities/lot';
import { InjectQueue } from 'nest-bull';
import { EMAILS, QUEUE_NAMES } from '../jobs/jobsList';
import { Queue } from 'bull';

@Injectable()
export class OrdersService implements OnModuleInit {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    @InjectQueue(QUEUE_NAMES.EMAILS) private readonly emailsQueue: Queue,
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

    if (!lot || lot.status !== LotStatus.closed) {
      throw new BadRequestException('Error! Bad lot info.');
    }

    // check if winner
    const winnersBid = getWinnersBid(lot.bids);
    if (!winnersBid || winnersBid.user.id !== user.id ) {
      throw new BadRequestException('You are not the winner of the lot');
    }

    try {
      const newOrder = await this.ordersRepository.save({
        arrivalLocation: orderDto.arrivalLocation,
        type: orderDto.type,
        status: OrderStatus.pending,
        bid: winnersBid,
      });
      await this.bidsService.update(winnersBid.id, { order: newOrder });
      await this.emailsQueue.add(EMAILS.ORDER_CREATED_EMAIL_TO_SELLER, {lot, user: lot.user});
      return newOrder;
    } catch (e) {
      this.loggerService.error(e);
      throw new UnprocessableEntityException('Error happened during saving order.');
    }
  }

  async update(lotId: number, orderDto: OrderDto, user: User): Promise<Order> {
    const lot = await this.lotsService.findOne(lotId);

    if (!lot || lot.status !== LotStatus.closed) {
      throw new BadRequestException('Error! Bad lot info.');
    }

    const winnersBid = getWinnersBid(lot.bids);
    if (!winnersBid || winnersBid.user.id !== user.id) {
      throw new BadRequestException('You are not the winner of the lot');
    }

    if (!winnersBid.order) {
      throw new BadRequestException('Error! Order doesn\'t exist yet.');
    }

    if (winnersBid.order.status !== OrderStatus.pending) {
      throw new BadRequestException('Only pending orders might be updated');
    }

    try {
      await this.ordersRepository.update(winnersBid.order.id, {
        arrivalLocation: orderDto.arrivalLocation,
        type: orderDto.type,
      });
      await this.emailsQueue.add(EMAILS.ORDER_UPDATED_EMAIL_TO_SELLER, {lot, user: lot.user});
      return await this.ordersRepository.findOne(winnersBid.order.id);
    } catch (e) {
      this.loggerService.error(e);
      throw new UnprocessableEntityException('Error happened during updating order.');
    }
  }

  async executeOrder(lotId: number, user: User): Promise<Lot> {
    const lot = await this.lotsService.findOne(lotId);

    if (!lot || lot.user.id !== user.id) {
      throw new BadRequestException('You are not the owner!');
    }

    const winnersBid = getWinnersBid(lot.bids);
    if (!winnersBid || !winnersBid.order) {
      throw new BadRequestException('Lots has no order yet!');
    }

    if (winnersBid.order.status !== OrderStatus.pending) {
      throw new BadRequestException('Order does not have pending status. Maybe, Lot already sent');
    }

    try {
      await this.ordersRepository.update(winnersBid.order.id, { status: OrderStatus.sent});
      await this.emailsQueue.add(EMAILS.ORDER_EXECUTED_EMAIL_TO_CUSTOMER, { user: winnersBid.user, lot });
      return await this.lotsService.findOne(lotId);
    } catch (e) {
      this.loggerService.error(e);
      throw new UnprocessableEntityException('Error happened during executing order.');
    }
  }

  async receiveOrder(lotId: number, user: User): Promise<Lot> {
    const lot = await this.lotsService.findOne(lotId);

    if (!lot) {
      throw new BadRequestException('Not such lot!');
    }

    const winnersBid = getWinnersBid(lot.bids);

    if (!winnersBid || winnersBid.order.status !== OrderStatus.sent) {
      throw new BadRequestException('Order has not been sent yet.');
    }

    if (winnersBid.user.id !== user.id) {
      throw new BadRequestException('You are not the order owner!');
    }

    try {
      await this.ordersRepository.update(winnersBid.order.id, { status: OrderStatus.delivered });
      await this.emailsQueue.add(EMAILS.ORDER_RECEIVED_EMAIL_TO_SELLER, { user: lot.user, lot });
      return await this.lotsService.findOne(lotId);
    } catch (e) {
      this.loggerService.error(e);
      throw new UnprocessableEntityException('Error happened during receiving order.');
    }
  }

  async findOne(orderId): Promise<Order> {
    return this.ordersRepository.findOne(orderId, {
      relations: ['bid'],
    });
  }

  async findOrders(userId: number, query): Promise<Order[]> {
    const findRequestBody = this.ordersRepository.createQueryBuilder('orders')
      .leftJoinAndSelect('orders.bid', 'bids')
      .leftJoinAndSelect('bids.user', 'bids_user')
      .leftJoinAndSelect('bids.lot', 'bids_lot');

    if (query.filters && query.filters === 'mylots') {
      return await findRequestBody
        .leftJoinAndSelect('bids_lot.user', 'bids_lot_user')
        .where('bids_lot_user.id = :id', { id: userId })
        .getMany();
    }

    return await findRequestBody
      .where('bids_user.id = :id', { id: userId })
      .getMany();
  }
}
