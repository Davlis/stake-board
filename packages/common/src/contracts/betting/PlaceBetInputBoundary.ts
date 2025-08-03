export interface PlaceBetInputBoundary {
  userId: string;
  gameId: string;
  selectedOutcome: 'home' | 'away' | 'draw';
  amount: number;
  market: string;
  bookmaker: string;
} 