import { Injectable, Inject } from '@nestjs/common';
import { IGameRepository } from 'domain/repositories/IGameRepository';
import { ListGamesOutputBoundary } from 'common';

@Injectable()
export class GetGames {
  constructor(
    @Inject(IGameRepository)
    private readonly gameRepository: IGameRepository,
  ) {}

  async execute(): Promise<ListGamesOutputBoundary> {
    const gameEntities = await this.gameRepository.getAll();

    const games = gameEntities.map((gameEntity) => ({
      id: gameEntity.id,
      gameId: gameEntity.gameId,
      homeTeam: gameEntity.homeTeam,
      awayTeam: gameEntity.awayTeam,
      status: gameEntity.status,
      commenceTime: gameEntity.commenceTime,
      result: gameEntity.result,
    }));

    return games;
  }
}
