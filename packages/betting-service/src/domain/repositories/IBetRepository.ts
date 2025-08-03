import { Bet, BetStatus } from 'domain/entities/Bet';
import { IGenericRepository } from 'domain/repositories/IGenericRepository';
import { Entity } from 'domain/types';

export interface SearchBetParams {
  status?: BetStatus;
}

export interface IBetRepository extends IGenericRepository<Bet> {
  findByUserId(userId: string): Promise<Entity<Bet>[]>;
  findByGameId(gameId: string): Promise<Entity<Bet>[]>;
  searchByParams(params: SearchBetParams): Promise<Entity<Bet>[]>;
}

export const IBetRepository = Symbol('BetRepository');
