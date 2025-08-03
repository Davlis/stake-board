import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { IBettingServiceProvider } from 'application/providers/IBettingServiceProvider';
import {
  GetUserBetSummaryInputBoundary,
  GetUserBetSummaryOutputBoundary,
  PlaceBetInputBoundary,
  PlaceBetOutputBoundary,
} from 'common';

@Injectable()
export class BettingServiceProvider implements IBettingServiceProvider {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl =
      this.configService.get<string>('BETTING_SERVICE_URL') ||
      'http://localhost:3001';
  }

  async placeBet(
    betData: PlaceBetInputBoundary,
  ): Promise<PlaceBetOutputBoundary> {
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post<PlaceBetOutputBoundary>(
          `${this.baseUrl}/bets`,
          betData,
        ),
      );
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to create bet in betting service: ${error.message}`,
      );
    }
  }

  // bets/user/:userId/status
  async getUserBetSummary(
    input: GetUserBetSummaryInputBoundary,
  ): Promise<GetUserBetSummaryOutputBoundary> {
    try {
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get<GetUserBetSummaryOutputBoundary>(
          `${this.baseUrl}/bets/user/${input.userId}/status`,
        ),
      );
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to create bet in betting service: ${error.message}`,
      );
    }
  }
}
