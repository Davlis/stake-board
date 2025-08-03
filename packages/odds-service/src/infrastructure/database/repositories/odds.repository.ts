import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Odds as DomainOdds } from 'domain/entities/Odds';
import { Odds } from 'infrastructure/database/entities/odds.entity';
import { Entity } from 'domain/types';
import GenericTypeORMRepository from 'infrastructure/database/repositories/generic.repository';
import { IOddsRepository } from '@/domain/repositories/IOddsRepository';

@Injectable()
export class OddsRepository
  extends GenericTypeORMRepository<DomainOdds, Odds>
  implements IOddsRepository
{
  constructor(
    @InjectRepository(Odds)
    oddsRepository: Repository<Odds>,
  ) {
    super(oddsRepository);
  }

  public mapRowToEntity = (row: Odds): Entity<DomainOdds> => {
    return {
      id: row.id,
      gameId: row.gameId,
      bookmaker: row.bookmaker,
      market: row.market,
      lastUpdate: row.lastUpdate,
      outcomes: row.outcomes,
    };
  };

  public mapEntityFieldsToRow(fields: Partial<DomainOdds>): Partial<Odds> {
    return {
      ...fields,
    };
  }

  async findLatestByGameId(gameId: string): Promise<Entity<DomainOdds>[]> {
    const rows = await this.repository
      .createQueryBuilder('odds')
      .distinctOn(['odds.bookmaker', 'odds.market'])
      .where('odds.gameId = :gameId', { gameId })
      .orderBy('odds.bookmaker', 'ASC')
      .addOrderBy('odds.market', 'ASC')
      .addOrderBy('odds.lastUpdate', 'DESC')
      .getMany();

    return rows.map(this.mapRowToEntity);
  }

  async findLatestOdds(): Promise<Entity<DomainOdds>[]> {
    const rows = await this.repository
      .createQueryBuilder('odds')
      .distinctOn(['odds.gameId', 'odds.bookmaker', 'odds.market'])
      .orderBy('odds.gameId', 'ASC')
      .addOrderBy('odds.bookmaker', 'ASC')
      .addOrderBy('odds.market', 'ASC')
      .addOrderBy('odds.lastUpdate', 'DESC')
      .getMany();

    return rows.map(this.mapRowToEntity);
  }
}
