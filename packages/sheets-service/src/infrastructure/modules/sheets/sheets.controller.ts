import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetUserBetSummary } from '@/application/useCases/GetUserBetSummary';
import { GetGamesAndOddsForTab } from '@/application/useCases/GetGamesAndOddsForSheet';
import { PlaceBet } from 'application/useCases/PlaceBet';
import { ParamUserIdDto, PlaceBetDto } from './dto/index';
import {
  SheetsPlaceBetInputBoundary,
  SheetsGetUserBetSummaryInputBoundary,
} from 'common';

@Controller('sheets')
export class SheetsController {
  constructor(
    private readonly getGamesAndOddsForTabUC: GetGamesAndOddsForTab,
    private readonly placeBetUC: PlaceBet,
    private readonly getUserBetSummaryUC: GetUserBetSummary,
  ) {}

  // Note (davlis): Should be protected via AuthGuard
  @Get('games')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async getGamesAndOddsForTab() {
    return await this.getGamesAndOddsForTabUC.execute();
  }

  // Note (davlis): Should be protected via AuthGuard
  @Post('users/:userId/bets')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async placeBet(
    @Param() param: ParamUserIdDto,
    @Body() placeBetDto: PlaceBetDto,
  ) {
    const input: SheetsPlaceBetInputBoundary = {
      userId: param.userId,
      gameId: placeBetDto.gameId,
      selectedOutcome: placeBetDto.selectedOutcome,
      amount: placeBetDto.amount,
      market: placeBetDto.market,
      bookmaker: placeBetDto.bookmaker,
    };

    return await this.placeBetUC.execute(input);
  }

  // Note (davlis): Should be protected via AuthGuard
  @Get('users/:userId/bets')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async getUserBetSummary(@Param('userId') userId: string) {
    const input: SheetsGetUserBetSummaryInputBoundary = { userId };
    return await this.getUserBetSummaryUC.execute(input);
  }
}
