import { BadRequestException, Injectable, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { getRepository, Repository } from 'typeorm';
import { Lot } from '../entities/lot';
// DTO's
import { CreateLotDto } from './dto/create-lot.dto';
import { User } from '../entities/user';
import { LoggerService } from '../shared/logger.service';

@Injectable()
export class LotsService {
  constructor(
    @InjectRepository(Lot) private lotsRepository: Repository<Lot>,
    private readonly loggerService: LoggerService,
  ) {}

  async findAll(): Promise<Lot[]> {
    return this.lotsRepository.find({ relations: ['user', 'bids'] });
  }

  async findAllByUserId(id: number): Promise<Lot[]> {
    return this.lotsRepository.find({ where: { user: { id }}, relations: ['user'] });
  }

  async find(id: number): Promise<Lot> {
    return this.lotsRepository.findOne({ where: {id}, relations: ['user', 'bids'] });
  }

  async findLotsByBidUserId(userId: number): Promise<Lot[]> {
    return await this.lotsRepository.createQueryBuilder('lots')
      .leftJoinAndSelect('lots.user', 'user')
      .leftJoinAndSelect('lots.bids', 'bids')
      .leftJoinAndSelect('bids.user', 'bidsuser')
      .where('bidsuser.id = :id', { id: userId })
      .getMany();
  }

  async delete(lotId: number) {
    return this.lotsRepository.delete(lotId);
  }

  async update(lotId: number, lotRequest: CreateLotDto, user): Promise<Lot> {

    const lot = await this.find(lotId);

    if (!lot) {
      throw new BadRequestException('Such lot doesn\'t exist.');
    }

    if (user.id !== lot.user.id) {
      throw new BadRequestException('You can not update lot you didn\'t create.');
    }

    try {
      const updLot = await this.lotsRepository.save(this.handleLot(lot, lotRequest, user));
      this.loggerService.log(`Lot Updated. Lot: id ${updLot.id} '${updLot.title}'. User '${user.firstName}', id: ${user.id}.`);
      return updLot;
    } catch ( errors ) {
      this.loggerService.error(errors);
      throw new BadRequestException('Error occurred during updating lot!');
    }
  }

  async create(lotRequest: CreateLotDto, user: User ) {
    try {
      const newLot = await this.lotsRepository.save(this.handleLot(new Lot(), lotRequest, user));
      this.loggerService.log(`Lot Created. Lot: id ${newLot.id} '${newLot.title}'. User '${user.firstName}', id: ${user.id}.`);
      return newLot;
    } catch ( errors ) {
      this.loggerService.error(errors);
      throw new BadRequestException('Error occurred during updating lot!');
    }
  }

  private handleLot(lot: Lot, lotRequest, user: User): Lot {
    lot.title = lotRequest.title;
    lot.image = lotRequest.image;
    lot.description = lotRequest.description;
    lot.currentPrice = lotRequest.currentPrice;
    lot.estimatedPrice = lotRequest.estimatedPrice;
    lot.startTime = moment(lotRequest.startTime).toDate();
    lot.endTime = moment(lotRequest.endTime).toDate();
    lot.user = user;
    return lot;
  }
}
