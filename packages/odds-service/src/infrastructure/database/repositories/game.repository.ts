import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Game as DomainGame } from 'domain/entities/Game';
import { Entity } from 'domain/types';
import { Game } from 'infrastructure/database/entities/game.entity';
import GenericTypeORMRepository from 'infrastructure/database/repositories/generic.repository';
import {
  GameSearchByParams,
  IGameRepository,
} from '@/domain/repositories/IGameRepository';

@Injectable()
export class GameRepository
  extends GenericTypeORMRepository<DomainGame, Game>
  implements IGameRepository
{
  constructor(
    @InjectRepository(Game)
    gameRepository: Repository<Game>,
  ) {
    super(gameRepository);
  }

  public mapRowToEntity(row: Game): Entity<DomainGame> {
    return {
      id: row.id,
      gameId: row.gameId,
      sportKey: row.sportKey,
      sportTitle: row.sportTitle,
      homeTeam: row.homeTeam,
      awayTeam: row.awayTeam,
      commenceTime: row.commenceTime,
      status: row.status,
      result: row.result,
    };
  }

  public mapEntityFieldsToRow(fields: Partial<DomainGame>): Partial<Game> {
    return {
      ...fields,
    };
  }

  async findByName(name: string): Promise<Entity<DomainGame> | null> {
    const row = await this.repository.findOne({ where: { sportKey: name } });
    return row ? this.mapRowToEntity(row) : null;
  }

  async searchByParams(
    params: GameSearchByParams,
  ): Promise<Entity<DomainGame>[]> {
    const entities = await this.getSearchByParamsQueryBuilder(params).getMany();

    return entities.map((e) => ({
      ...this.mapRowToEntity(e),
    }));
  }

  private getSearchByParamsQueryBuilder(params: GameSearchByParams) {
    let queryBuilder = this.repository.createQueryBuilder('game');

    if (params.status) {
      queryBuilder = queryBuilder.andWhere({ status: In(params.status) });
    }

    return queryBuilder;
  }
}
