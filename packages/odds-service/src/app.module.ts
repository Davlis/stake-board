import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { InfrastructureModule } from 'infrastructure/infrastructure.module';
import { OddsModule } from './infrastructure/modules/odds/odds.module';

@Module({
  imports: [InfrastructureModule, OddsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
