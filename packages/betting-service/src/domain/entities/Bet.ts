export type BetStatus = 'pending' | 'won' | 'lost';
export type BetOutcome = 'home' | 'away' | 'draw';

export interface Bet {
  gameId: string;
  userId: string;
  selectedOutcome: BetOutcome;
  bookmaker: string;
  market: string;
  amount: number;
  odds: number;
  payout?: number;
  status: BetStatus;
}
