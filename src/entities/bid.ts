import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user';

@Entity('bids')
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bid_creation_time: Date;

  @Column()
  proposed_price: number;
  
  @ManyToOne(type => User, user => user.first_name)
  user: User;
}
