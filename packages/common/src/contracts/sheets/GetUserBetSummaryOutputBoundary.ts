export interface SheetsUserBetSummaryData {
  userId: string;
  totalBets: number;
  pendingBets: number;
  wonBets: number;
  lostBets: number;
  totalWagered: number;
  totalWinnings: number;
  netProfit: number;
  bets: {
    id: string;
    gameId: string;
    selectedOutcome: 'home' | 'away' | 'draw';
    bookmaker: string;
    market: string;
    amount: number;
    status: 'pending' | 'won' | 'lost';
    potentialWinnings: number;
  }[];
}

export type SheetsGetUserBetSummaryOutputBoundary = SheetsUserBetSummaryData;
