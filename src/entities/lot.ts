import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

import { User } from './user';
import { Bid } from './bid';

export enum LotStatus {
  pending = 'pending',
  inProcess = 'inProcess',
  closed = 'closed',
}

@Entity('lots')
export class Lot {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'title', type: 'varchar', length: 255})
  title: string;

  @Column({ name: 'image', type: 'varchar', length: 255, nullable: true})
  image?: string;

  @Column({ name: 'description', type: 'text', nullable: true})
  description?: string;

  @Column({ name: 'status', type: 'enum', enum: LotStatus, default: LotStatus.pending})
  status?: string;

  @Column({ name: 'current_price', type: 'float'})
  currentPrice: number;

  @Column({ name: 'estimated_price', type: 'float'})
  estimatedPrice: number;

  @Column({ name: 'start_time', type: 'timestamp'})
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp'})
  endTime: Date;

  @ManyToOne(type => User, user => user.lots)
  user: User;

  @OneToMany(type => Bid, bid => bid.lot)
  bids: Bid[];
}
