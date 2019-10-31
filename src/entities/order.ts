import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Bid } from './bid';

export enum TypeStatus {
  pending = 'pending',
  royalMail = 'Royal Mail',
  unitedStatesPostalService = 'United States Postal Service',
  dhlExpress = 'DHL Express',
}

export enum OrderStatus {
  pending = 'pending',
  sent = 'sent',
  delivered = 'delivered',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: 'arrival_location', type: 'text', nullable: true })
  arrivalLocation: string;

  @Column({type: 'enum', enum: TypeStatus})
  type: string;

  @Column({type: 'enum', enum: OrderStatus})
  status: string;

  @OneToOne(type => Bid, bid => bid.order)
  @JoinColumn()
  bid: Bid;
}
