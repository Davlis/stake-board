import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from 'infrastructure/database/database.module';
import { OddsApiProvider } from 'infrastructure/odds/OddsApiProvider';
import { IOddsApiProvider } from 'application/odds/providers/IOddsApiProvider';

@Module({
  imports: [DatabaseModule, HttpModule],
  providers: [
    { provide: IOddsApiProvider, useClass: OddsApiProvider },
    OddsApiProvider,
  ],
  exports: [
    DatabaseModule,
    OddsApiProvider,
    { provide: IOddsApiProvider, useClass: OddsApiProvider },
  ],
})
export class InfrastructureModule {}
