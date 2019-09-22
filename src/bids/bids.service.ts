import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as moment from 'moment';
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

  async create(bidData: CreateBidDto, user: User, lot: Lot ) {

    const newBid = new Bid();
    newBid.proposedPrice = bidData.proposedPrice;
    newBid.bidCreationTime = moment().toDate();
    newBid.user = user;
    newBid.lot = lot;

    const savedBid = await this.bidsRepository.save(newBid);

    return savedBid;
  }
}
