import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { SheetsModule } from './infrastructure/modules/sheets/sheets.module';

@Module({
  imports: [InfrastructureModule, SheetsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
