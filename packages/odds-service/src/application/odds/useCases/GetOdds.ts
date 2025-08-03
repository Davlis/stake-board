import { Injectable, Inject } from '@nestjs/common';
import { IOddsRepository } from '@/domain/repositories/IOddsRepository';
import { ListOddsOutputBoundary } from 'common';

@Injectable()
export class GetOdds {
  constructor(
    @Inject(IOddsRepository)
    private readonly oddsRepository: IOddsRepository,
  ) {}

  async execute(): Promise<ListOddsOutputBoundary> {
    const oddsEntities = await this.oddsRepository.findLatestOdds();

    const odds = oddsEntities.map((oddsEntity) => ({
      id: oddsEntity.id,
      gameId: oddsEntity.gameId,
      bookmaker: oddsEntity.bookmaker,
      outcomes: oddsEntity.outcomes,
      market: oddsEntity.market,
      lastUpdate: oddsEntity.lastUpdate,
    }));

    return odds;
  }
}
