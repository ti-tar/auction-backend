import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany, BeforeInsert } from 'typeorm';
import { IsEmail } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Lot } from './lot';
import { Bid } from './bid';

// utils
import { createHmac } from 'crypto';


@Entity('users')
@Unique(['email', 'phone'])
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'email', type: 'varchar', length: 255 })
  @IsEmail()
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

  @BeforeInsert()
  hashPassword() {
    this.password = createHmac('sha256', this.password).digest('hex')
  }

  @OneToMany(type => Lot, user => user.title)
  lots: Lot[];

  @OneToMany(type => Bid, bid => bid.proposedPrice)
  bids: Bid[];
}