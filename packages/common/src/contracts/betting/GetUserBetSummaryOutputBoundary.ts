export interface UserBetSummaryData {
  userId: string;
  totalBets: number;
  pendingBets: number;
  wonBets: number;
  lostBets: number;
  totalWagered: number;
  totalWinnings: number;
  netProfit: number;
  bets: UserBet[];
}

export interface UserBet {
  id: string;
  gameId: string;
  selectedOutcome: 'home' | 'away' | 'draw';
  bookmaker: string;
  market: string;
  amount: number;
  potentialWinnings: number;
  status: 'pending' | 'won' | 'lost';
}

export type GetUserBetSummaryOutputBoundary = UserBetSummaryData;
