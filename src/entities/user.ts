import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Lot } from './lot';
import { Bid } from './bid';

@Entity('users')
@Unique(['email', 'phone'])
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'email', type: 'varchar', length: 255 })
  email: string;

  @Column({ name: 'phone', type: 'integer' })
  phone: number;

  @Exclude()
  @Column({ name: 'password', type: 'varchar', length: 255 })
  password: string;
  
  @Column({ name: 'first_name', type: 'varchar', length: 255 })
  firstName: string;
  
  @Column({ name: 'last_name', type: 'varchar', length: 255 })
  lastName: string;

  @Column({ name: 'birthday', type: 'timestamp' })
  birthday: Date;

  @OneToMany(type => Lot, user => user.title)
  lots: Lot[];

  @OneToMany(type => Bid, bid => bid.proposedPrice)
  bids: Bid[];
}