import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user';

enum Status {
  pending = 'pending',
  inProcess = 'inProcess',
  closed = 'closed'
};

@Entity('lots')
export class Lot {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255})
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true})
  image?: string;

  @Column({ type: 'text', nullable: true})
  description?: string;

  @Column({type: 'enum', enum: Status})
  status: string;

  @Column({ type: 'float'})
  current_price: number;

  @Column({ type: 'float'})
  estimated_price: number;

  @Column({ type: 'timestamp'})
  start_time: Date;

  @Column({ type: 'timestamp'})
  end_time: Date;

  @ManyToOne(type => User, user => user.first_name)
  user: User;
}
