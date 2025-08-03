import { Inject, Injectable } from '@nestjs/common';
import { IOddsServiceProvider } from '../providers/IOddsServiceProvider';
import { GetGamesAndOddsForTabOutputBoundary } from 'common';

@Injectable()
export class GetGamesAndOddsForTab {
  constructor(
    @Inject(IOddsServiceProvider)
    private readonly oddsServiceProvider: IOddsServiceProvider,
  ) {}

  // TODO (davlis): This should be filtered by userId and timestamp
  // TODO (davlis): Ideally it should rely on single query via SQL join.
  async execute(): Promise<GetGamesAndOddsForTabOutputBoundary> {
    const games = await this.oddsServiceProvider.getGames();
    const odds = await this.oddsServiceProvider.getOdds();

    const gamesWithOdds = games.map((game) => {
      const gameOdds = odds.filter((odd) => odd.gameId === game.gameId);
      return {
        game,
        odds: gameOdds.map((gameOdd) => ({
          id: gameOdd.gameId,
          gameId: gameOdd.gameId,
          bookmaker: gameOdd.bookmaker,
          market: gameOdd.market,
          lastUpdate: gameOdd.lastUpdate,
          outcomes: gameOdd.outcomes.map((outcome) => ({
            name: outcome.name,
            price: outcome.price,
          })),
        })),
      };
    });
    return gamesWithOdds;
  }
}
