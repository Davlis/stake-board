import {
  GetUserBetSummaryInputBoundary,
  GetUserBetSummaryOutputBoundary,
  PlaceBetInputBoundary,
  PlaceBetOutputBoundary,
} from 'common';

export interface IBettingServiceProvider {
  placeBet(input: PlaceBetInputBoundary): Promise<PlaceBetOutputBoundary>;
  getUserBetSummary(
    input: GetUserBetSummaryInputBoundary,
  ): Promise<GetUserBetSummaryOutputBoundary>;
}

export const IBettingServiceProvider = Symbol('BettingServiceProvider');
