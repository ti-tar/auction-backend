import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
// import { Transform } from 'class-transformer';

import { User } from './user';

// const moment = require("moment");

export enum Status {
  pending = 'pending',
  inProcess = 'inProcess',
  closed = 'closed'
};

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

  @Column({ name: 'status', type: 'enum', enum: Status, default: 'pending'})
  status?: string;

  @Column({ name: 'current_price', type: 'float'})
  currentPrice: number;

  @Column({ name: 'estimated_price', type: 'float'})
  estimatedPrice: number;

  // @Transform((startTime:string): Date => moment(startTime))
  @Column({ name: 'start_time', type: 'timestamp'})
  startTime: Date;

  // @Transform((endTime:string): Date => moment(endTime))
  @Column({ name: 'end_time', type: 'timestamp'})
  endTime: Date;

  @ManyToOne(type => User, user => user.firstName)
  user: User;
}
