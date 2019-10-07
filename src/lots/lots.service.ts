import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import { Lot } from '../entities/lot';
// DTO's
import { CreateLotDto } from './dto/create-lot.dto';
import { User } from '../entities/user';
import { LoggerService } from '../shared/logger.service';
import { LotJobsService } from './lot-jobs.service';

@Injectable()
export class LotsService {
  constructor(
    @InjectRepository(Lot) private lotsRepository: Repository<Lot>,
    private readonly lotJobsService: LotJobsService,
    private readonly loggerService: LoggerService,
  ) {}

  async findLotsInProcess(): Promise<Lot[]> {
    return this.lotsRepository.find({ where: { status: 'inProcess' }, relations: ['user', 'bids'] });
  }

  async findAllByUserId(id: number): Promise<Lot[]> {
    return this.lotsRepository.find({ where: { user: { id }}, relations: ['user', 'bids'] });
  }

  async find(id: number): Promise<Lot> {
    return this.lotsRepository.findOne({ where: {id}, relations: ['user', 'bids'] });
  }

  async findOne(queryObj): Promise<Lot> {
    return this.lotsRepository.findOne(queryObj);
  }

  async save(entity): Promise<Lot> {
    return this.lotsRepository.save(entity);
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
    const lot = await this.lotsRepository.findOne(lotId);
    if (lot.status !== 'pending') {
      throw new BadRequestException(`Only lot with status 'pending' might be updated or deleted.`);
    }
    return this.lotsRepository.delete(lotId);
  }

  async setLotToAuction(lotId: number, user: any): Promise<Lot> {
    const lot = await this.lotsRepository.findOne({ where: { id: lotId }, relations: ['user'] });
    if (!lot) {
      throw new BadRequestException('There\'s no such lot in database.');
    }
    if (user.id !== lot.user.id) {
      throw new BadRequestException('You can update only your own lots.');
    }
    if (lot.status !== 'pending') {
      throw new BadRequestException('Only lot with status pending might be set to isProcessed status.');
    }
    lot.startTime = moment().toDate();
    lot.status = 'inProcess';

    try {
      await this.lotsRepository.save(lot);
      const delay: number = moment(lot.endTime).valueOf() - moment().valueOf();
      this.loggerService.log(`Lot Created. Lot: id ${lot.id} '${lot.title}'. User '${user.firstName}', id: ${user.id}.`);
      await this.lotJobsService.addJob('setEndLotTimeJob', lot, { delay });
      // tslint:disable-next-line:max-line-length
      this.loggerService.log(`Job. Lot Create Event. Set job to lot endTime handling. Lot id: ${lot.id}. Job start/endTime - ${moment(lot.startTime).toISOString()}/${moment(lot.endTime).toISOString()}. Delay time: ${delay / 1000} seconds.`);
    } catch (e) {
      throw new BadRequestException('Error occurred during setting lot to auction!');
    }

    return await this.lotsRepository.save(lot);
  }

  async update(lotId: number, lotRequest: CreateLotDto, user): Promise<Lot> {

    const lot = await this.find(lotId);

    if (!lot) {
      throw new BadRequestException('Such lot doesn\'t exist.');
    }

    if (user.id !== lot.user.id) {
      throw new BadRequestException('You can update only your own lots.');
    }

    if (lot.status !== 'pending') {
      throw new BadRequestException(`Only lot with status 'pending' might be updated or deleted.`);
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
