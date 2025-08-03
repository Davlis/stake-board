export interface GameWithOddsForTabData {
  game: {
    id: string;
    homeTeam: string;
    awayTeam: string;
    status: string;
    result: string;
    commenceTime: Date;
  }
  odds: {
    id: string;
    gameId: string;
    bookmaker: string;
    market: string;
    lastUpdate: Date;
    outcomes: {
      name: string;
      price: number;
    }[]
  }[];
}

export type GetGamesAndOddsForTabOutputBoundary = GameWithOddsForTabData[];
