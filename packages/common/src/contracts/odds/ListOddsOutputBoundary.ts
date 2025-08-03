export interface OddsData {
  id: string;
  gameId: string;
  bookmaker: string;
  market: string;
  outcomes: {
    name: string;
    price: number;
  }[];
  lastUpdate: Date;
}

export type ListOddsOutputBoundary = OddsData[];
