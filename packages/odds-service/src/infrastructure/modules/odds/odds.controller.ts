import {
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RefreshOdds } from 'application/odds/useCases/RefreshOdds';
import { RandomizeGameResult } from '@/application/odds/useCases/RandomizeGameResult';
import { GetGames } from 'application/odds/useCases/GetGames';
import { GetGameWithOdds } from '@/application/odds/useCases/GetGame';
import { GetOdds } from 'application/odds/useCases/GetOdds';
import { GetGameDto } from './dto/index';
import {
  GetGameWithOddsInputBoundary,
  RefreshOddsInputBoundary,
  RandomizeGameResultInputBoundary,
} from 'common';

@Controller('odds')
export class OddsController {
  constructor(
    private readonly refreshOddsUC: RefreshOdds,
    private readonly randomizeGameResultUC: RandomizeGameResult,
    private readonly getGamesUC: GetGames,
    private readonly getGameWithOddsUC: GetGameWithOdds,
    private readonly getOddsUC: GetOdds,
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async listOdds() {
    return await this.getOddsUC.execute();
  }

  @Post('refresh')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async refresh() {
    const input: RefreshOddsInputBoundary = {};
    return await this.refreshOddsUC.execute(input);
  }

  @Get('games')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async listGames() {
    return await this.getGamesUC.execute();
  }

  @Get('games/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async getGameWithOdds(@Param() params: GetGameDto) {
    const input: GetGameWithOddsInputBoundary = { id: params.id };
    return await this.getGameWithOddsUC.execute(input);
  }

  @Post('games/random')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async randomizeGameResult() {
    const input: RandomizeGameResultInputBoundary = {};
    return await this.randomizeGameResultUC.execute(input);
  }
}
