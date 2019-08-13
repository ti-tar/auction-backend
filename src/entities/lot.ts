import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Lot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255})
  title: string;

  @Column({ type: 'varchar', length: 255})
  image?: string;

  @Column({ type: 'text'})
  description?: string;

  @Column({ type: 'varchar', length: 255})
  status: string;

  @Column("float")
  currentPrice: number;

  @Column("float")
  estimatedPrice: number;

  @Column("datetime")
  lotStartTime: string;

  @Column("datetime")
  lotEndTime: string;
}