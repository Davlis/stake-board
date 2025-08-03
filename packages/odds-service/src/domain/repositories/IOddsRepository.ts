import { Odds } from '../entities/Odds';
import { Entity } from '../types';
import { IGenericRepository } from './IGenericRepository';

export interface IOddsRepository extends IGenericRepository<Odds> {
  findLatestByGameId(gameId: string): Promise<Entity<Odds>[]>;
  findLatestOdds(): Promise<Entity<Odds>[]>;
}

export const IOddsRepository = Symbol('OddsRepository');
