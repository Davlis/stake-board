import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  IOddsApiProvider,
  FetchOddsResponse,
  FetchGameScoreResponse,
} from 'application/odds/providers/IOddsApiProvider';
import { AxiosResponse } from 'axios';

const SPORT_KEY = 'soccer_epl';
const REGIONS = 'eu';
const MARKETS = 'h2h';
const ODDS_FORMAT = 'decimal';

@Injectable()
export class OddsApiProvider implements IOddsApiProvider {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('ODDS_API_KEY');
    const baseUrl = this.configService.get<string>('ODDS_API_BASE_URL');

    if (!apiKey) {
      throw new Error('ODDS_API_KEY is not configured');
    }

    if (!baseUrl) {
      throw new Error('ODDS_API_BASE_URL is not configured');
    }

    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async fetchUnfinishedGameOdds(): Promise<FetchOddsResponse> {
    const url = `${this.baseUrl}/sports/${SPORT_KEY}/odds/?apiKey=${this.apiKey}&regions=${REGIONS}&markets=${MARKETS}&oddsFormat=${ODDS_FORMAT}`;

    try {
      const response: AxiosResponse<FetchOddsResponse> = await firstValueFrom(
        this.httpService.get<FetchOddsResponse>(url),
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(
        `Failed to fetch odds from external API: ${errorMessage}`,
      );
    }
  }

  async fetchGamesScore(gameIds: string[]): Promise<FetchGameScoreResponse> {
    const eventsQP = gameIds.join(',');
    const url = `${this.baseUrl}/sports/${SPORT_KEY}/events/?apiKey=${this.apiKey}&eventIds=${eventsQP}`;

    try {
      const response: AxiosResponse<FetchGameScoreResponse> =
        await firstValueFrom(this.httpService.get<FetchGameScoreResponse>(url));
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(
        `Failed to fetch odds from external API: ${errorMessage}`,
      );
    }
  }
}
