import { Inject, Injectable } from '@nestjs/common';
import { IOddsRepository } from 'domain/repositories/IOddsRepository';
import { Odds } from 'domain/entities/Odds';
import {
  IOddsApiProvider,
  Outcome,
} from 'application/odds/providers/IOddsApiProvider';
import { IGameRepository } from '@/domain/repositories/IGameRepository';
import { Game } from '@/domain/entities/Game';
import { Entity } from '@/domain/types';
import { RefreshOddsInputBoundary, RefreshOddsOutputBoundary } from 'common';

@Injectable()
export class RefreshOdds {
  constructor(
    @Inject(IOddsRepository)
    private readonly oddsRepository: IOddsRepository,

    @Inject(IGameRepository)
    private readonly gameRepository: IGameRepository,

    @Inject(IOddsApiProvider)
    private readonly oddsApiProvider: IOddsApiProvider,
  ) {}

  async execute(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _input: RefreshOddsInputBoundary,
  ): Promise<RefreshOddsOutputBoundary> {
    const databaseGames = await this.gameRepository.getAll();
    const unfinishedGames =
      await this.oddsApiProvider.fetchUnfinishedGameOdds();

    const allGameIds = [
      ...new Set([
        ...databaseGames.map((g) => g.gameId),
        ...unfinishedGames.map((g) => g.id),
      ]),
    ];

    const gamesScore = await this.oddsApiProvider.fetchGamesScore(allGameIds);

    const dbGameMap = new Map(databaseGames.map((g) => [g.gameId, g]));
    const scoreMap = new Map(gamesScore.map((g) => [g.id, g]));

    const { gamesToInsert, gamesToUpdate } = unfinishedGames.reduce<{
      gamesToInsert: Game[];
      gamesToUpdate: Entity<Game>[];
    }>(
      (acc, game) => {
        const dbGame = dbGameMap.get(game.id);
        const liveScore = scoreMap.get(game.id);

        const hasStarted = new Date(game.commence_time).getTime() < Date.now();
        const status = !hasStarted ? 'upcoming' : 'running';

        const homeScore = liveScore?.scores?.find(
          (s) => s.name === game.home_team,
        );
        const awayScore = liveScore?.scores?.find(
          (s) => s.name === game.away_team,
        );

        const result =
          homeScore && awayScore
            ? `${homeScore.score}-${awayScore.score}`
            : 'N/A';

        const gameFields = {
          gameId: game.id,
          sportKey: game.sport_key,
          sportTitle: game.sport_title,
          homeTeam: game.home_team || 'N/A',
          awayTeam: game.away_team || 'N/A',
          commenceTime: new Date(game.commence_time),
          status,
          result,
        };

        if (!dbGame) {
          acc.gamesToInsert.push(gameFields);
        } else {
          acc.gamesToUpdate.push({ id: dbGame.id, ...gameFields });
        }

        return acc;
      },
      { gamesToInsert: [], gamesToUpdate: [] },
    );

    if (gamesToInsert.length > 0) {
      await Promise.all(
        gamesToInsert.map((g) => this.gameRepository.create(g)),
      );
    }

    // TODO: Dispatch game_update event
    if (gamesToUpdate.length > 0) {
      await Promise.all(
        gamesToUpdate.map((g) => this.gameRepository.update(g.id, g)),
      );
    }

    const allOdds: Odds[] = unfinishedGames.reduce<Odds[]>((acc, game) => {
      const gameOdds = game.bookmakers.flatMap((bookmaker) =>
        bookmaker.markets.map((market) => ({
          gameId: game.id,
          bookmaker: bookmaker.key,
          market: market.key,
          lastUpdate: new Date(market.last_update),
          outcomes: market.outcomes.map((o: Outcome) => ({
            name: o.name,
            price: o.price,
          })),
        })),
      );
      return acc.concat(gameOdds);
    }, []);

    if (allOdds.length > 0) {
      await Promise.all(
        allOdds.map((odds) => this.oddsRepository.create(odds)),
      );
    }

    return { status: 'ok' };
  }
}
