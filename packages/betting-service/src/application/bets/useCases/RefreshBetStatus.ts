import { Injectable, Inject } from '@nestjs/common';
import { IBetRepository } from 'domain/repositories/IBetRepository';
import { BetOutcome } from 'domain/entities/Bet';
import { IOddsServiceClient, Game } from '../providers/IOddsServiceClient';
import {
  RefreshBetStatusInputBoundary,
  RefreshBetStatusOutputBoundary,
} from 'common';

@Injectable()
export class RefreshBetStatus {
  constructor(
    @Inject(IBetRepository)
    private readonly betRepository: IBetRepository,
    @Inject(IOddsServiceClient)
    private readonly oddsServiceClient: IOddsServiceClient,
  ) {}

  async execute(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _input: RefreshBetStatusInputBoundary,
  ): Promise<RefreshBetStatusOutputBoundary> {
    const pendingBets = await this.betRepository.searchByParams({
      status: 'pending',
    });

    let updatedBetsCount = 0;

    for (const pendingBet of pendingBets) {
      const { game } = await this.oddsServiceClient.getGameById(
        pendingBet.gameId,
      );

      // This is simple case, bet might be lost already even if the game is running
      if (game.status === 'finished') {
        const won = this.isBetWon(game, pendingBet.selectedOutcome);

        await this.betRepository.update(pendingBet.id, {
          ...pendingBet,
          status: won ? 'won' : 'lost',
          payout: won ? pendingBet.amount * pendingBet.odds : 0,
        });

        ++updatedBetsCount;
      }
    }

    return {
      status: 'ok',
      updatedBets: updatedBetsCount,
    };
  }

  private isBetWon(game: Game, selectedOutcome: BetOutcome): boolean {
    if (!game.result || game.result === 'N/A') {
      return false;
    }

    const [homeScore, awayScore] = game.result
      .split('-')
      .map((score) => Number(score));

    if (isNaN(homeScore) || isNaN(awayScore)) {
      return false;
    }

    let actualOutcome: 'home' | 'away' | 'draw';

    if (homeScore > awayScore) {
      actualOutcome = 'home';
    } else if (awayScore > homeScore) {
      actualOutcome = 'away';
    } else {
      actualOutcome = 'draw';
    }

    return selectedOutcome === actualOutcome;
  }
}
