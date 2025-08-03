import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Odds {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  gameId: string;

  @Column()
  bookmaker: string;

  @Column()
  market: string;

  @Column()
  lastUpdate: Date;

  @Column('jsonb')
  outcomes: Array<{ name: string; price: number }>;
}
