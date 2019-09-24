import { BadRequestException, Body, Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lot } from '../entities/lot';
import { Bid } from '../entities/bid';
import { CreateBidDto } from './dto/create-bid.dto';
import { User } from '../entities/user';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid) private bidsRepository: Repository<Bid>,
  ) {}

  async findAllByLotId(lotId: number): Promise<Bid[]> {
    return await this.bidsRepository.find({
      where: {lot: { id: lotId }},
      relations: ['user'],
    });
  }

  async getBidsCountByLotId(lotId: number): Promise<number> {
    return await this.bidsRepository.createQueryBuilder('bids').where({lot: { id: lotId }}).getCount();
  }

  async addBid(bidData: CreateBidDto, user: User, lot: Lot ) {

    if (!lot) {
      throw new BadRequestException('Lot info error');
    }

    if (lot.user.id === user.id) {
      throw new BadRequestException('You can\'t bid to your own lots');
    }

    if (lot.bids && lot.bids.length && bidData.proposedPrice <= lot.bids[lot.bids.length - 1].proposedPrice) {
      throw new BadRequestException('Bid should be higher last proposed bid.');
    }

    return await this.bidsRepository.save({
      proposedPrice: bidData.proposedPrice,
      bidCreationTime: new Date(),
      user,
      lot,
    });
  }
}
