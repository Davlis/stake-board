import { Module } from '@nestjs/common';
import { SheetsController } from 'infrastructure/modules/sheets/sheets.controller';
import { InfrastructureModule } from 'infrastructure/infrastructure.module';
import { GetGamesAndOddsForTab } from 'application/useCases/GetGamesAndOddsForSheet';
import { PlaceBet } from 'application/useCases/PlaceBet';
import { GetUserBetSummary } from 'application/useCases/GetUserBetSummary';

@Module({
  imports: [InfrastructureModule],
  controllers: [SheetsController],
  providers: [GetGamesAndOddsForTab, PlaceBet, GetUserBetSummary],
  exports: [GetGamesAndOddsForTab, PlaceBet, GetUserBetSummary],
})
export class SheetsModule {}
