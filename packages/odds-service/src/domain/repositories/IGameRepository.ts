import { Game } from 'domain/entities/Game';
import { Entity } from 'domain/types';

import { IGenericRepository } from './IGenericRepository';

export interface GameSearchByParams {
  status?: string[];
}

export interface IGameRepository extends IGenericRepository<Game> {
  searchByParams(params: GameSearchByParams): Promise<Entity<Game>[]>;
  findByName(name: string): Promise<Entity<Game> | null>;
}

export const IGameRepository = Symbol('GameRepository');
