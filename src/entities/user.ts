import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm';
import { Lot } from './lot';
import { Bid } from './bid';

@Entity('users')
@Unique(['email', 'phone'])
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'integer' })
  phone: number;

  @Column({ type: 'varchar', length: 255 })
  password: string;
  
  @Column({ type: 'varchar', length: 255 })
  first_name: string;
  
  @Column({ type: 'varchar', length: 255 })
  last_name: string;

  @Column({ type: 'timestamp' })
  birthday: Date;

  @OneToMany(type => Lot, user => user.title)
  lots: Lot[];

  @OneToMany(type => Bid, bid => bid.proposed_price)
  bids: Bid[];
}