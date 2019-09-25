import { BadRequestException, Injectable, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import { Lot } from '../entities/lot';
// DTO's
import { CreateLotDto } from './dto/create-lot.dto';
import { User } from '../entities/user';

@Injectable()
export class LotsService {
  constructor(@InjectRepository(Lot) private lotsRepository: Repository<Lot>) {}

  async findAll(): Promise<Lot[]> {
    return this.lotsRepository.find({
      relations: ['user'],
    });
  }

  async findAllByUserId(id: number): Promise<Lot[]> {
    return this.lotsRepository.find({
      where: {user: { id }},
      relations: ['user'],
    });
  }

  async find(id: number): Promise<Lot> {
    return this.lotsRepository.findOne({
      where: {id},
      relations: ['user', 'bids'],
    });
  }

  async update(lotRequest: CreateLotDto, lotId: number) {

    this.lotValidation(lotRequest);

    const lot = await this.lotsRepository.findOne(lotId);

    await this.lotsRepository.update(lotId,
      {
        ...lotRequest,
        startTime: moment(lotRequest.startTime).toDate(),
        endTime: moment(lotRequest.endTime).toDate(),
      },
    );
    return lot;
  }

  async delete(lotId: number) {
    return this.lotsRepository.delete(lotId);
  }

  async create(lotRequest: CreateLotDto, user: User ) {

    this.lotValidation(lotRequest);

    const newLot = new Lot();
    newLot.title = lotRequest.title;
    newLot.image = lotRequest.image;
    newLot.description = lotRequest.description;
    newLot.currentPrice = lotRequest.currentPrice;
    newLot.estimatedPrice = lotRequest.estimatedPrice;
    newLot.startTime = moment(lotRequest.startTime).toDate();
    newLot.endTime = moment(lotRequest.endTime).toDate();
    newLot.user = user;

    return await this.lotsRepository.save(newLot);
  }

  private lotValidation(values: CreateLotDto) {
    const { currentPrice, estimatedPrice, startTime, endTime } = values;

    if (estimatedPrice <= currentPrice) {
      throw new BadRequestException('Estimated price should be less or equal then current.');
    }

    const startTimeDate = moment(startTime);
    const endTimeDate = moment(endTime);

    if (!startTimeDate.isValid() || !endTimeDate.isValid() ) {
      throw new BadRequestException('Lot start or end time is not valid.');
    }

    if (!endTimeDate.isAfter(startTime)) {
      throw new BadRequestException('End of lot\'s bidding should not be later it start.');
    }
  }
}
