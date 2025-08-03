export interface BetData {
  id: string;
  userId: string;
  gameId: string;
  selectedOutcome: 'home' | 'away' | 'draw';
  amount: number;
  status: 'pending' | 'won' | 'lost';
  potentialWinnings: number;
}

export type PlaceBetOutputBoundary = BetData;
