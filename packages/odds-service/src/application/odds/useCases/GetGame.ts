import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IGameRepository } from 'domain/repositories/IGameRepository';
import { IOddsRepository } from '@/domain/repositories/IOddsRepository';
import {
  GetGameWithOddsInputBoundary,
  GetGameWithOddsOutputBoundary,
} from 'common';

@Injectable()
export class GetGameWithOdds {
  constructor(
    @Inject(IGameRepository)
    private readonly gameRepository: IGameRepository,

    @Inject(IOddsRepository)
    private readonly oddsRepository: IOddsRepository,
  ) {}

  async execute(
    input: GetGameWithOddsInputBoundary,
  ): Promise<GetGameWithOddsOutputBoundary> {
    const game = await this.gameRepository.getById(input.id);
    if (!game) {
      throw new NotFoundException('Game not found.');
    }

    const oddsEntities = await this.oddsRepository.findLatestByGameId(
      game.gameId,
    );

    return {
      game: {
        id: game.id,
        gameId: game.gameId,
        homeTeam: game.homeTeam,
        awayTeam: game.awayTeam,
        status: game.status,
        commenceTime: game.commenceTime,
        result: game.result,
      },
      odds: oddsEntities.map((odd) => ({
        gameId: odd.gameId,
        bookmaker: odd.bookmaker,
        market: odd.market,
        lastUpdate: odd.lastUpdate,
        outcomes: odd.outcomes.map((outcome) => ({
          name: outcome.name,
          price: outcome.price,
        })),
      })),
    };
  }
}
