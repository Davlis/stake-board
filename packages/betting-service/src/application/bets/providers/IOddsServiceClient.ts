import { GetGameWithOddsOutputBoundary, ListGamesOutputBoundary } from 'common';

export type Odds = GetGameWithOddsOutputBoundary['odds'];
export type Game = GetGameWithOddsOutputBoundary['game'];

export interface IOddsServiceClient {
  getGameById(gameId: string): Promise<GetGameWithOddsOutputBoundary>;
  getGames(): Promise<ListGamesOutputBoundary>;
}

export const IOddsServiceClient = Symbol('OddsServiceClient');
