import { Inject, Injectable } from '@nestjs/common';
import { IBettingServiceProvider } from 'application/providers/IBettingServiceProvider';
import {
  SheetsPlaceBetInputBoundary,
  SheetsPlaceBetOutputBoundary,
} from 'common';

@Injectable()
export class PlaceBet {
  constructor(
    @Inject(IBettingServiceProvider)
    private readonly bettingServiceProvider: IBettingServiceProvider,
  ) {}

  async execute(
    input: SheetsPlaceBetInputBoundary,
  ): Promise<SheetsPlaceBetOutputBoundary> {
    try {
      const result = await this.bettingServiceProvider.placeBet({
        userId: input.userId,
        gameId: input.gameId,
        selectedOutcome: input.selectedOutcome,
        amount: input.amount,
        bookmaker: input.bookmaker,
        market: input.market,
      });

      const betData = {
        id: result.gameId,
        userId: result.userId,
        gameId: result.gameId,
        selectedOutcome: result.selectedOutcome,
        amount: result.amount,
        status: result.status,
        potentialWinnings: result.potentialWinnings,
      };

      return betData;
    } catch (error) {
      throw new Error(`Failed to place bet: ${(error as Error).message}`);
    }
  }
}
