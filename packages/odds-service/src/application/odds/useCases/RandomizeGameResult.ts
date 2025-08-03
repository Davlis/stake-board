import { Injectable, Inject } from '@nestjs/common';
import { IGameRepository } from 'domain/repositories/IGameRepository';
import {
  RandomizeGameResultInputBoundary,
  RandomizeGameResultOutputBoundary,
} from 'common';

@Injectable()
export class RandomizeGameResult {
  constructor(
    @Inject(IGameRepository)
    private readonly gameRepository: IGameRepository,
  ) {}

  async execute(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _input: RandomizeGameResultInputBoundary,
  ): Promise<RandomizeGameResultOutputBoundary> {
    const games = await this.gameRepository.searchByParams({
      status: ['upcoming', 'running', 'finished'],
    });

    for (const game of games) {
      const home = Math.floor(Math.random() * 5);
      const away = Math.floor(Math.random() * 5);
      const result = `${home}-${away}`;
      await this.gameRepository.update(game.id, { ...game, result });
      // TODO (davlis): Dispatch game_update event
    }

    return { status: 'ok', count: games.length };
  }
}
