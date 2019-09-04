import { Injectable, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { Lot } from '../entities/lot';
import { Bid } from '../entities/bid';
// DTO's  
import { CreateBidDto } from './create-bid.dto';
import { User } from '../entities/user';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid) private bidsRepository: Repository<Bid>
  ) {}

  async findAllByLotId(lotId: number): Promise<Bid[]> {
    return await this.bidsRepository.find({ 
      where: {lot: { id: lotId }},
      relations: ['bid'],
    });
  }

  async create(bidRequest: CreateBidDto, user: User, lot: Lot ) {
    
    const moment = require("moment");

    const { proposedPrice } = bidRequest;

    let newbid = new Bid();
    newbid.proposedPrice = proposedPrice;
    newbid.bidCreationTime = moment();
    newbid.user = user;
    newbid.lot = lot;

    console.log(newbid);

    // todo validation !!!

    const savedBid = await this.bidsRepository.save(newbid);

    console.log(savedBid);

    return savedBid;
  } 
}
