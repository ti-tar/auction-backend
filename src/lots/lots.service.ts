import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lot } from '../entities/lot';
// DTO's  
import { CreateLotDto } from './create-lot.dto';

@Injectable()
export class LotsService {
  constructor(
    @InjectRepository(Lot)
    private lotsRepository: Repository<Lot>
  ) {}

  async findAll(): Promise<Lot[]> {
    return await this.lotsRepository.find();
  }

  async find(id: number): Promise<Lot> {
    return await this.lotsRepository.findOne(id);
  }

  async create(lotRequest: CreateLotDto) {
    
    const moment = require("moment");

    const { title, image, description, currentPrice, estimatedPrice, startTime, endTime } = lotRequest;

    let newLot = new Lot();
    newLot.title = title;
    newLot.image = image;
    newLot.description = description;
    newLot.currentPrice = currentPrice;
    newLot.estimatedPrice = estimatedPrice;
    newLot.startTime = moment(startTime);
    newLot.endTime = moment(endTime);

    // todo validation !!!

    return await this.lotsRepository.save(newLot);

    // console.log(savedUser);

    // console.log(await this.lotsRepository.save(lotRequest));
  } 
}
