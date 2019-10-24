import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToOne, JoinColumn } from 'typeorm';
import { Bid } from './bid';

export enum TypeStatus {
  pending = 'pending',
  royal_mail = 'Royal Mail',
  united_states_postal_service = 'United States Postal Service',
  dhl_expres = 'DHL Express',
}

export enum Status {
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

  @Column({type: 'enum', enum: Status})
  status: string;

  @OneToOne(type => Bid, bid => bid.proposedPrice)
  @JoinColumn()
  bid: Bid;
}
