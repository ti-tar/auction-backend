import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { DeleteResult, Repository } from 'typeorm';
import { InjectQueue } from 'nest-bull';
import { Queue } from 'bull';
import { Lot } from '../entities/lot';
import { CreateLotDto } from './dto/create-lot.dto';
import { User } from '../entities/user';
import { LoggerService } from '../shared/logger.service';
import { Pagination } from '../shared/pagination';
import { ConfigService } from '../shared/config.service';
import { JOBS, QUEUE_NAMES } from '../jobs/jobsList';

@Injectable()
export class LotsService {
  constructor(
    @InjectRepository(Lot) private lotsRepository: Repository<Lot>,
    @InjectQueue(QUEUE_NAMES.LOTS) private readonly queue: Queue,
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
  ) {}

  async findAndCountLotsInProcess(paginateOptions): Promise<Pagination<Lot>> {
    const [data, total] = await this.lotsRepository.findAndCount({
      where: { status: 'inProcess' },
      relations: ['user', 'bids'],
      take: this.configService.config.pagination.perPage,
      skip: this.configService.config.pagination.perPage * (paginateOptions.page - 1),
    });

    return new Pagination<Lot>({data, total});
  }

  async findAndCountLotsByUserId(id: number, paginateOptions): Promise<Pagination<Lot>> {
    const [data, total] = await this.lotsRepository.findAndCount({
      where: { user: { id } },
      relations: ['user', 'bids'],
      take: this.configService.config.pagination.perPage,
      skip: this.configService.config.pagination.perPage * (paginateOptions.page - 1),
    });

    return new Pagination<Lot>({data, total});
  }

  async findAndCountLotsByBidUserId(userId: number, paginateOptions): Promise<Pagination<Lot>> {
    const [data, total] = await this.lotsRepository.createQueryBuilder('lots')
      .leftJoinAndSelect('lots.user', 'user')
      .leftJoinAndSelect('lots.bids', 'bids')
      .leftJoinAndSelect('bids.user', 'bidsuser')
      .where('bidsuser.id = :id', { id: userId })
      .take(this.configService.config.pagination.perPage)
      .skip(this.configService.config.pagination.perPage * (paginateOptions.page - 1))
      .getManyAndCount();

    return new Pagination<Lot>({data, total});
  }

  async findOne(id: number): Promise<Lot> {
    return this.lotsRepository.findOne(id, { relations: ['user', 'bids'] });
  }

  async delete(lotId: number): Promise<DeleteResult> {
    const lot = await this.lotsRepository.findOne(lotId);
    if (lot.status !== 'pending') {
      throw new BadRequestException(`Only lot with status 'pending' might be updated or deleted.`);
    }
    return this.lotsRepository.delete(lotId);
  }

  async setLotToAuction(lotId: number, user: any): Promise<Lot> {
    const lot = await this.findOne(lotId);
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

    if (!moment(lot.endTime).isAfter(lot.startTime.toISOString())) {
      throw new BadRequestException('Lot endtime should be grater than current time.');
    }

    try {
      await this.lotsRepository.save(lot);
      const delay: number = moment(lot.endTime).valueOf() - moment().valueOf();
      this.loggerService.log(`Set Lot ToAuction. Lot: id ${lot.id} '${lot.title}'. User '${user.firstName}', id: ${user.id}.`);
      await this.queue.add(JOBS.LOT_END_TIME_JOB, lot, { delay });
      this.loggerService.log(`Job. Lot Create Event. Set job to lot endTime handling. Lot id: ${lot.id}. ` +
        `Job start/endTime - ${moment(lot.startTime).toISOString()}/${moment(lot.endTime).toISOString()}. Delay time: ${delay / 1000} seconds.`);
      return lot;
    } catch (e) {
      throw new BadRequestException('Error occurred during setting lot to auction!');
    }
  }

  async update(lotId: number, lotRequest: CreateLotDto, user): Promise<Lot> {

    const lot = await this.findOne(lotId);

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
