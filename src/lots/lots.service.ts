import { Injectable } from '@nestjs/common';

import { Lot } from './lot.interface';
import { CreateLotDto } from './create-lot.dto';

@Injectable()
export class LotsService {
  private readonly lots: Lot[] = [];

  findAll(): Lot[] {
    return this.lots;
  }

  // create(lot: Lot) {
  create(lot: any) {
    this.lots.push(lot);
  } 
}
