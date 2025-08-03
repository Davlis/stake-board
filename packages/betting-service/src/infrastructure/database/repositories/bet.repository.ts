import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bet as DomainBet } from 'domain/entities/Bet';
import { Bet } from 'infrastructure/database/entities/bet.entity';
import { Entity } from 'domain/types';
import GenericTypeORMRepository from 'infrastructure/database/repositories/generic.repository';
import { SearchBetParams } from 'domain/repositories/IBetRepository';

@Injectable()
export class BetRepository extends GenericTypeORMRepository<DomainBet, Bet> {
  constructor(
    @InjectRepository(Bet)
    betRepository: Repository<Bet>,
  ) {
    super(betRepository);
  }

  public mapRowToEntity = (row: Bet): Entity<DomainBet> => {
    return {
      id: row.id,
      userId: row.userId,
      gameId: row.gameId,
      selectedOutcome: row.selectedOutcome,
      bookmaker: row.bookmaker,
      market: row.market,
      amount: row.amount,
      odds: row.odds,
      payout: row.payout || undefined,
      status: row.status,
    };
  };

  public mapEntityFieldsToRow(fields: Partial<DomainBet>): Partial<Bet> {
    return {
      ...fields,
    };
  }

  async findByUserId(userId: string): Promise<Entity<DomainBet>[]> {
    const rows = await this.repository.find({ where: { userId } });
    return rows.map(this.mapRowToEntity);
  }

  async findByGameId(gameId: string): Promise<Entity<DomainBet>[]> {
    const rows = await this.repository.find({ where: { gameId } });
    return rows.map(this.mapRowToEntity);
  }

  async searchByParams(params: SearchBetParams): Promise<Entity<DomainBet>[]> {
    const where: Record<string, unknown> = {};

    if (params.status) {
      where.status = params.status;
    }

    const rows = await this.repository.find({ where });
    return rows.map(this.mapRowToEntity);
  }
}
