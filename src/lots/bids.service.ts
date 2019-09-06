import { Injectable, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import * as moment from 'moment';
//

import { Lot } from '../entities/lot';
import { Bid } from '../entities/bid';

// DTO's
import { CreateBidDto } from './create-bid.dto';
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
    // find({
    //   where: {lot: { id: lotId }}
    // });
  }

  async create(bidRequest: CreateBidDto, user: User, lot: Lot ) {

    const { proposedPrice } = bidRequest;

    const newbid = new Bid();
    newbid.proposedPrice = proposedPrice;
    newbid.bidCreationTime = moment().toDate();
    newbid.user = user;
    newbid.lot = lot;

    // todo validation !!!

    const savedBid = await this.bidsRepository.save(newbid);

    return savedBid;
  }
}
