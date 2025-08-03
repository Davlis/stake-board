export interface GameWithOddsData {
  game: {
    id: string;
    gameId: string;
    homeTeam: string;
    awayTeam: string;
    commenceTime: Date;
    status: string;
    result: string;
  },
  odds: {
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

export type GetGameWithOddsOutputBoundary = GameWithOddsData;
