import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  gameId: string;

  @Column()
  sportKey: string;

  @Column()
  sportTitle: string;

  @Column()
  homeTeam: string;

  @Column()
  awayTeam: string;

  @Column()
  commenceTime: Date;

  @Column({ default: 'upcoming' })
  status: string;

  @Column({ nullable: true })
  result: string;
}
