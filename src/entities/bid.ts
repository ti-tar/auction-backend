import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user';
import { Lot } from './lot';
import { Order } from './order';

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

  @OneToOne(type => Order, order => order.bid)
  @JoinColumn()
  order: Order;
}
