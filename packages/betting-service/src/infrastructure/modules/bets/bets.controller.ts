import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PlaceBet } from 'application/bets/useCases/PlaceBet';
import { GetUserBetSummary } from 'application/bets/useCases/GetUserBetSummary';
import { RefreshBetStatus } from 'application/bets/useCases/RefreshBetStatus';
import { PlaceBetDto, GetUserBetSummaryDto } from './dto/index';
import {
  PlaceBetInputBoundary,
  GetUserBetSummaryInputBoundary,
  RefreshBetStatusInputBoundary,
} from 'common';

@Controller('bets')
export class BetsController {
  constructor(
    private readonly placeBetUC: PlaceBet,
    private readonly getUserBetSummaryUC: GetUserBetSummary,
    private readonly refreshBetStatusUC: RefreshBetStatus,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createBet(@Body() dto: PlaceBetDto) {
    const input: PlaceBetInputBoundary = {
      userId: dto.userId,
      gameId: dto.gameId,
      selectedOutcome: dto.selectedOutcome,
      amount: dto.amount,
      market: dto.market,
      bookmaker: dto.bookmaker,
    };
    return await this.placeBetUC.execute(input);
  }

  @Get('user/:userId/status')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async getUserBetSummaryStatus(@Param() params: GetUserBetSummaryDto) {
    const input: GetUserBetSummaryInputBoundary = { userId: params.userId };
    return await this.getUserBetSummaryUC.execute(input);
  }

  // Ideally this is a cron job that runs every X seconds / Or react to events
  @Post('refresh-status')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async refreshBetStatus() {
    const input: RefreshBetStatusInputBoundary = {};
    return await this.refreshBetStatusUC.execute(input);
  }
}
