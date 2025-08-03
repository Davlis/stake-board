import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { IOddsServiceProvider } from 'application/providers/IOddsServiceProvider';
import { ListGamesOutputBoundary, ListOddsOutputBoundary } from 'common';

@Injectable()
export class OddsServiceProvider implements IOddsServiceProvider {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl =
      this.configService.get<string>('ODDS_SERVICE_URL') ||
      'http://localhost:3002';
  }

  async getGames(): Promise<ListGamesOutputBoundary> {
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get<ListGamesOutputBoundary>(
          `${this.baseUrl}/odds/games`,
        ),
      );
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch games from odds service: ${error.message}`,
      );
    }
  }

  async getOdds(): Promise<ListOddsOutputBoundary> {
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get<ListOddsOutputBoundary>(`${this.baseUrl}/odds`),
      );
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch odds from odds service: ${error.message}`,
      );
    }
  }
}
