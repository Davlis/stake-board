import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IBetRepository } from 'domain/repositories/IBetRepository';

import {
  GetUserBetSummaryInputBoundary,
  GetUserBetSummaryOutputBoundary,
} from 'common';

@Injectable()
export class GetUserBetSummary {
  constructor(
    @Inject(IBetRepository)
    private readonly betRepository: IBetRepository,
  ) {}

  async execute(
    input: GetUserBetSummaryInputBoundary,
  ): Promise<GetUserBetSummaryOutputBoundary> {
    const bets = await this.betRepository.findByUserId(input.userId);

    if (bets.length === 0) {
      throw new NotFoundException(`No bets found for user: ${input.userId}`);
    }

    const pendingBets = bets.filter((bet) => bet.status === 'pending');
    const wonBets = bets.filter((bet) => bet.status === 'won');
    const lostBets = bets.filter((bet) => bet.status === 'lost');

    const totalWinnings = wonBets.reduce((total, bet) => {
      return total + (bet.payout || 0);
    }, 0);

    const totalWagered = bets.reduce((total, bet) => {
      return total + bet.amount;
    }, 0);

    const netProfit = totalWinnings - totalWagered;

    const summary = {
      userId: input.userId,
      totalBets: bets.length,
      pendingBets: pendingBets.length,
      wonBets: wonBets.length,
      lostBets: lostBets.length,
      totalWagered,
      totalWinnings,
      netProfit,
      bets: bets.map((bet) => ({
        id: bet.id,
        gameId: bet.gameId,
        selectedOutcome: bet.selectedOutcome,
        market: bet.market,
        bookmaker: bet.bookmaker,
        amount: bet.amount,
        status: bet.status,
        potentialWinnings: bet.amount * bet.odds,
      })),
    };

    return summary;
  }
}
