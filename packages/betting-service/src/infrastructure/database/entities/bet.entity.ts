import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type BetStatus = 'pending' | 'won' | 'lost';

@Entity()
export class Bet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  gameId: string;

  @Column()
  selectedOutcome: 'home' | 'away' | 'draw';

  @Column()
  bookmaker: string;

  @Column()
  market: string;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'float' })
  odds: number;

  @Column({ type: 'float', nullable: true })
  payout: number | null;

  @Column({ default: 'pending' })
  status: BetStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
