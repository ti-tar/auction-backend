import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user';
import { Lot } from './lot';

@Entity('bids')
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'bid_creation_time' })
  bidCreationTime: Date;

  @Column({ name: 'proposed_price' })
  proposedPrice: number;
  
  @ManyToOne(type => User, user => user.bids)
  user: User;

  @ManyToOne(type => Lot, lot => lot.bids)
  lot: Lot;
}
