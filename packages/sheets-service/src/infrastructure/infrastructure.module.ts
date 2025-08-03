import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { IBettingServiceProvider } from 'application/providers/IBettingServiceProvider';
import { BettingServiceProvider } from 'infrastructure/providers/BettingServiceProvider';
import { IOddsServiceProvider } from 'application/providers/IOddsServiceProvider';
import { OddsServiceProvider } from 'infrastructure/providers/OddsServiceProvider';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HttpModule,
  ],
  providers: [
    {
      provide: IBettingServiceProvider,
      useClass: BettingServiceProvider,
    },
    {
      provide: IOddsServiceProvider,
      useClass: OddsServiceProvider,
    },
  ],

  exports: [IBettingServiceProvider, IOddsServiceProvider],
})
export class InfrastructureModule {}
