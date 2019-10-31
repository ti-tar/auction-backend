import { BadRequestException, Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Queue } from 'bull';
import { Lot, LotStatus } from '../entities/lot';
import { Bid } from '../entities/bid';
import { CreateBidDto } from './dto/create-bid.dto';
import { User } from '../entities/user';
import { LotsGateway } from '../lots/lots.gateway';
import { OrdersService } from '../orders/orders.service';
import { LoggerService } from '../shared/logger.service';
import { InjectQueue } from 'nest-bull';
import { EMAILS, QUEUE_NAMES } from '../jobs/jobsList';
import { getWinnersBid } from '../libs/helpers';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid) private bidsRepository: Repository<Bid>,
    @InjectRepository(Lot) private readonly lotsRepository: Repository<Lot>,
    @InjectQueue(QUEUE_NAMES.EMAILS) private readonly emailsQueue: Queue,
    private readonly lotsGateway: LotsGateway,
    private readonly ordersService: OrdersService,
    private readonly loggerService: LoggerService,
  ) {}

  async findOne(bidId: number): Promise<Bid> {
    return await this.bidsRepository.findOne(bidId, { relations: ['user', 'order'] });
  }

  async findAllBidsByLotId(lotId: number): Promise<[Bid[], number]> {
    return await this.bidsRepository.findAndCount({
      where: {lot: { id: lotId }},
      relations: ['user'],
    });
  }

  async addBid(lot: Lot, bidData: CreateBidDto, user: User ) {
    if (!lot) {
      throw new BadRequestException('Lot info error');
    }

    if (lot.status !== LotStatus.inProcess ) {
      throw new BadRequestException(`You can bid only lots with status 'inProcess'.`);
    }

    if (lot.user.id === user.id) {
      throw new BadRequestException('You can\'t bid to your own lots');
    }

    if (lot.bids && lot.bids.length && bidData.proposedPrice <= getWinnersBid(lot.bids).proposedPrice) {
      throw new BadRequestException('Bid should be higher last proposed bid.');
    }

    if (bidData.proposedPrice <= lot.currentPrice) {
      throw new BadRequestException('Bid should be higher current price.');
    }

    try {
      const savedBid: Bid = await this.bidsRepository.save({
        proposedPrice: bidData.proposedPrice,
        bidCreationTime: new Date(),
        user,
        lot,
      });

      this.lotsGateway.bidsUpdate({
        message: `${user.firstName} just added new bid for lot '${lot.title}'[${lot.id}]`,
        params: {
          lotId: lot.id,
        },
      });

      if (bidData.proposedPrice >= lot.estimatedPrice) {
        await this.lotsRepository.update(lot.id, { status: LotStatus.closed });
        this.loggerService.log('Bid price is over lot\'s estimated price. Lot is closed. ' +
          `Lot: ${lot.title}(${lot.id}), Seller: ${lot.user.firstName}(${lot.user.id}), Customer: ${user.firstName}(${user.id})`);

        await this.emailsQueue.add(EMAILS.BUY_IT_NOW_EMAIL_TO_CUSTOMER, { customer: user, seller: lot.user, lot });
        await this.emailsQueue.add(EMAILS.BUY_IT_NOW_EMAIL_TO_SELLER, { customer: user, seller: lot.user, lot });
      }
      return savedBid;
    } catch (e) {
      this.loggerService.error(e);
      throw new NotImplementedException('Error occurred during adding bid.');
    }

  }

  async update(id, updatedData) {
    return await this.bidsRepository.update(id, updatedData);
  }
}
