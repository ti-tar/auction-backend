import { Injectable, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { Lot } from '../entities/lot';
// DTO's  
import { CreateLotDto } from './create-lot.dto';
import { UpdateLotDto } from './update-lot.dto';
import { User } from '../entities/user';

@Injectable()
export class LotsService {
  constructor(
    @InjectRepository(Lot) private lotsRepository: Repository<Lot>
  ) {}

  async findAll(): Promise<Lot[]> {
    return await this.lotsRepository.find({
      relations: ['user']
    });
  }

  async findAllByUserId(id: number): Promise<Lot[]> {
    return await this.lotsRepository.find({ 
      where: {user: { id: id }},
      relations: ['user'],
    });
  }

  async find(id: number): Promise<Lot> {
    return await this.lotsRepository.findOne(
      { where: {id}, relations: ['user']}
    );
  }

  async update(lotRequest: UpdateLotDto) {

    const moment = require("moment");

    const { 
      id, title, image, description, currentPrice, 
      estimatedPrice, startTime, endTime 
    } = lotRequest;

    const updatedLot = await getConnection()
    .createQueryBuilder()
    .update(Lot)
    .set({ 
      title: title,
      image: image,
      description: description,
      currentPrice: currentPrice,
      estimatedPrice: estimatedPrice,
      startTime: moment(startTime),
      endTime: moment(endTime),
    })
    .where("id = :id", { id })
    .execute();

    // console.log(updatedLot); 

    return updatedLot;
  }

  async create(lotRequest: CreateLotDto, user: User ) {
    
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

    newLot.user = user;

    const savedLot = await this.lotsRepository.save(newLot);

    return savedLot;

  } 
}
