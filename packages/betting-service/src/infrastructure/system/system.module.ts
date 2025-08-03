import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from 'infrastructure/database/database.module';
import { OddsServiceClient } from 'infrastructure/clients/OddsServiceClient';
import { IOddsServiceClient } from 'application/bets/providers/IOddsServiceClient';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    DatabaseModule,
  ],
  providers: [
    {
      provide: IOddsServiceClient,
      useClass: OddsServiceClient,
    },
  ],
  exports: [HttpModule, DatabaseModule, IOddsServiceClient],
})
export class SystemModule {}
