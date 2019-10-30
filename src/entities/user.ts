import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm';
import { IsEmail } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Lot } from './lot';
import { Bid } from './bid';

export enum UserStatus {
  pending = 'pending',
  approved = 'approved',
}

@Entity('users')
@Unique(['email'])
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'email', type: 'varchar', length: 255 })
  @IsEmail()
  email: string;

  @Column({ name: 'phone', type: 'varchar', length: 12 })
  phone: string;

  @Exclude()
  @Column({ name: 'password', type: 'varchar', length: 255 })
  password: string;

  @Column({ name: 'first_name', type: 'varchar', length: 255 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 255 })
  lastName: string;

  @Column({ name: 'status', type: 'enum', enum: UserStatus, default: UserStatus.pending})
  status?: string;

  @Column({ name: 'token', type: 'varchar', length: 255, nullable: true })
  token: string;

  @OneToMany(type => Lot, lot => lot.user)
  lots: Lot[];

  @OneToMany(type => Bid, bid => bid.user)
  bids: Bid[];
}
