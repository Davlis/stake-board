import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IOddsServiceClient } from 'application/bets/providers/IOddsServiceClient';

import { GetGameWithOddsOutputBoundary, ListGamesOutputBoundary } from 'common';

@Injectable()
export class OddsServiceClient implements IOddsServiceClient {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getGameById(gameId: string): Promise<GetGameWithOddsOutputBoundary> {
    try {
      const baseUrl =
        this.configService.get<string>('ODDS_SERVICE_URL') ||
        'http://localhost:3001';
      const response = await firstValueFrom(
        this.httpService.get<GetGameWithOddsOutputBoundary>(
          `${baseUrl}/odds/games/${gameId}`,
        ),
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Failed to fetch game from odds service: ${error.message}`,
      );
    }
  }

  async getGames(): Promise<ListGamesOutputBoundary> {
    try {
      const baseUrl =
        this.configService.get<string>('ODDS_SERVICE_URL') ||
        'http://localhost:3001';
      // games/with-odds
      const response = await firstValueFrom(
        this.httpService.get<ListGamesOutputBoundary>(`${baseUrl}/odds/games`),
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Failed to fetch games from odds service: ${error.message}`,
      );
    }
  }
}
