import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToOne } from 'typeorm';
import { Bid } from './bid';

enum TypeStatus {
  royal_mail = 'Royal Mail',
  united_states_postal_service = 'United States Postal Service',
  dhl_expres = 'DHL Express'
};

enum Status {
  pending = 'pending',
  sent = 'sent',
  delivered = 'delivered'
};

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  arrival_location: string;

  @Column({type: 'enum', enum: TypeStatus})
  type: string;

  @Column({type: 'enum', enum: Status})
  status: string;

  @OneToOne(type => Bid, bid => bid.proposedPrice)
  bid: Bid;
}