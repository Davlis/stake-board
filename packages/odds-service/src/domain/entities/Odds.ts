export interface Odds {
  gameId: string;
  bookmaker: string;
  market: string;
  lastUpdate: Date;
  outcomes: OddOutcome[];
}

export interface OddOutcome {
  name: string;
  price: number;
}
