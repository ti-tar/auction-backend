import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lot } from '../entities/lot';
// import { CreateLotDto } from './create-lot.dto';

@Injectable()
export class LotsService {
  constructor(
    // @InjectRepository(Lot)
    private lotsRepository: Repository<Lot>
  ) {}

  async findAll(): Promise<Lot[]> {
    return await this.lotsRepository.find();
  }

  async create(lot: Lot) {
    await this.lotsRepository.save(lot)
  } 

  // create(lot: Lot) {
  // async create(lot: CreateLotDto) {
  //   await this.lotsRepository.save(lot);
  // } 
}
