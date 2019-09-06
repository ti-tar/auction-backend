import { Lot } from '../entities/lot';
import { EntityRepository, Repository } from 'typeorm';
import { LotDto } from './lot.interface';

@EntityRepository(Lot)
export class LotRepository extends Repository<Lot> {
  createLot = async (lotDto: LotDto) => {
    return await this.save(lotDto);
  }
}
