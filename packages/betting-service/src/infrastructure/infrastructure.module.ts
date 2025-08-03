import { Module } from '@nestjs/common';
import { BetsModule } from 'infrastructure/modules/bets/bets.module';

@Module({
  imports: [BetsModule],
  exports: [BetsModule],
})
export class InfrastructureModule {}
