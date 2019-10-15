import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lot } from '../entities/lot';
import { Bid } from '../entities/bid';
import { CreateBidDto } from './dto/create-bid.dto';
import { User } from '../entities/user';
import { LotsGateway } from '../lots/lots.gateway';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid) private bidsRepository: Repository<Bid>,
    private readonly lotsGateway: LotsGateway,
    private readonly ordersService: OrdersService,
  ) {}

  async findAllBidsByLotId(lotId: number): Promise<[Bid[], number]> {
    return await this.bidsRepository.findAndCount({
      where: {lot: { id: lotId }},
      relations: ['user'],
    });
  }

  async addBid(bidData: CreateBidDto, user: User, lot: Lot ) {
    if (!lot) {
      throw new BadRequestException('Lot info error');
    }

    if (lot.status !== 'inProcess') {
      throw new BadRequestException(`You can bid only lots with status 'inProcess'.`);
    }

    if (lot.user.id === user.id) {
      throw new BadRequestException('You can\'t bid to your own lots');
    }

    if (lot.bids && lot.bids.length && bidData.proposedPrice <= lot.bids[lot.bids.length - 1].proposedPrice) {
      throw new BadRequestException('Bid should be higher last proposed bid.');
    }

    if (bidData.proposedPrice <= lot.currentPrice) {
      throw new BadRequestException('Bid should be higher current price.');
    }

    const savedBid =  await this.bidsRepository.save({
      proposedPrice: bidData.proposedPrice,
      bidCreationTime: new Date(),
      user,
      lot,
    });

    this.lotsGateway.bidsUpdate({
      message: `Someone just added new bid for lot '${lot.title}'[${lot.id}]`,
      params: {
        lotId: lot.id,
      },
    });

    if ( bidData.proposedPrice >= lot.estimatedPrice ) {
      await this.ordersService.create();
      // todo email and etc
    }

    return savedBid;
  }
}
