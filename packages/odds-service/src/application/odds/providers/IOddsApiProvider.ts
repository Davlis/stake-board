export interface SingleOddReturn {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string | null;
  away_team: string | null;
  bookmakers: Bookmaker[];
}

export interface Bookmaker {
  key: string;
  title: string;
  last_update: string;
  markets: Market[];
  link: string | null;
  sid: string | null;
}

export interface Market {
  key: string;
  last_update: string;
  outcomes: Outcome[];
  link: string | null;
  sid: string | null;
}

export interface Outcome {
  name: string;
  price: number;
  point: number | null;
  description: string;
  link: string | null;
  sid: string | null;
  bet_limit: number | null;
}

export interface SingleGameScoreReturn {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  completed?: boolean;
  home_team: string;
  away_team: string;
  scores?: {
    name: string;
    score: string;
  }[];
  last_update: string;
}

export type FetchOddsResponse = SingleOddReturn[];
export type FetchGameScoreResponse = SingleGameScoreReturn[];

export interface IOddsApiProvider {
  fetchUnfinishedGameOdds(): Promise<FetchOddsResponse>;
  fetchGamesScore(gameIds: string[]): Promise<FetchGameScoreResponse>;
}

export const IOddsApiProvider = Symbol('IOddsApiProvider');
