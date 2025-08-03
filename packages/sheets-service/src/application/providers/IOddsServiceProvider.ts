import { ListGamesOutputBoundary, ListOddsOutputBoundary } from 'common';

export interface IOddsServiceProvider {
  getOdds(): Promise<ListOddsOutputBoundary>;
  getGames(): Promise<ListGamesOutputBoundary>;
}

export const IOddsServiceProvider = Symbol('OddsServiceProvider');
