import { Inject, Injectable } from '@nestjs/common';

import { IBettingServiceProvider } from 'application/providers/IBettingServiceProvider';
import {
  SheetsGetUserBetSummaryInputBoundary,
  SheetsGetUserBetSummaryOutputBoundary,
} from 'common';

@Injectable()
export class GetUserBetSummary {
  constructor(
    @Inject(IBettingServiceProvider)
    private readonly bettingServiceProvider: IBettingServiceProvider,
  ) {}

  // TODO (davlis): This should be filtered by userId and timestamp, paginated.
  async execute(
    input: SheetsGetUserBetSummaryInputBoundary,
  ): Promise<SheetsGetUserBetSummaryOutputBoundary> {
    try {
      const summary = await this.bettingServiceProvider.getUserBetSummary({
        userId: input.userId,
      });

      return summary;
    } catch (error) {
      throw new Error(`Failed to get bets: ${(error as Error).message}`);
    }
  }
}
