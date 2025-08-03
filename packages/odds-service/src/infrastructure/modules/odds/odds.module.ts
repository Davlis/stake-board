import { Module } from '@nestjs/common';
import { OddsController } from 'infrastructure/modules/odds/odds.controller';
import { InfrastructureModule } from 'infrastructure/infrastructure.module';
import { DatabaseModule } from 'infrastructure/database/database.module';

import { RefreshOdds } from 'application/odds/useCases/RefreshOdds';
import { RandomizeGameResult } from '@/application/odds/useCases/RandomizeGameResult';
import { GetGames } from 'application/odds/useCases/GetGames';
import { GetGameWithOdds } from 'application/odds/useCases/GetGame';
import { GetOdds } from 'application/odds/useCases/GetOdds';

@Module({
  imports: [InfrastructureModule, DatabaseModule],
  controllers: [OddsController],
  providers: [
    GetOdds,
    RefreshOdds,
    RandomizeGameResult,
    GetGameWithOdds,
    GetGames,
  ],
  exports: [
    GetOdds,
    RefreshOdds,
    RandomizeGameResult,
    GetGameWithOdds,
    GetGames,
  ],
})
export class OddsModule {}
