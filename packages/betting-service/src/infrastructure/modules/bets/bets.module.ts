import { Module } from '@nestjs/common';
import { BetsController } from 'infrastructure/modules/bets/bets.controller';
import { SystemModule } from 'infrastructure/system/system.module';
import { PlaceBet } from 'application/bets/useCases/PlaceBet';
import { GetUserBetSummary } from 'application/bets/useCases/GetUserBetSummary';
import { RefreshBetStatus } from 'application/bets/useCases/RefreshBetStatus';

@Module({
  imports: [SystemModule],
  providers: [PlaceBet, GetUserBetSummary, RefreshBetStatus],
  controllers: [BetsController],
})
export class BetsModule {}
