import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { IBetRepository } from 'domain/repositories/IBetRepository';
import { Bet, BetOutcome } from 'domain/entities/Bet';
import {
  IOddsServiceClient,
  Odds,
  Game,
} from 'application/bets/providers/IOddsServiceClient';
import { PlaceBetInputBoundary, PlaceBetOutputBoundary } from 'common';

@Injectable()
export class PlaceBet {
  constructor(
    @Inject(IBetRepository)
    private readonly betRepository: IBetRepository,
    @Inject(IOddsServiceClient)
    private readonly oddsServiceClient: IOddsServiceClient,
  ) {}

  async execute(input: PlaceBetInputBoundary): Promise<PlaceBetOutputBoundary> {
    const { game, odds } = await this.oddsServiceClient.getGameById(
      input.gameId,
    );

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const now = new Date();
    const commenceTime = new Date(game.commenceTime);

    if (commenceTime <= now) {
      throw new BadRequestException('Cannot place bet on already started game');
    }

    const outcome = this.findOddsForOutcome(
      game,
      odds,
      input.selectedOutcome,
      input.market,
      input.bookmaker,
    );

    if (!outcome) {
      throw new BadRequestException(
        'Invalid outcome or odds not available for the specified market and bookmaker',
      );
    }

    const bet: Bet = {
      gameId: input.gameId,
      userId: input.userId,
      selectedOutcome: input.selectedOutcome,
      bookmaker: input.bookmaker,
      market: input.market,
      amount: input.amount,
      odds: outcome,
      status: 'pending',
    };

    const savedBet = await this.betRepository.create(bet);

    const betData = {
      id: savedBet.id,
      userId: savedBet.userId,
      gameId: savedBet.gameId,
      selectedOutcome: savedBet.selectedOutcome,
      bookmaker: savedBet.bookmaker,
      market: savedBet.market,
      amount: savedBet.amount,
      status: savedBet.status,
      potentialWinnings: savedBet.amount * savedBet.odds,
    };

    return betData;
  }

  private findOddsForOutcome(
    game: Game,
    odds: Odds,
    selectedOutcome: BetOutcome,
    market: string,
    bookmaker: string,
  ): number | null {
    const filteredOdds = odds.filter(
      (odd) => odd.market === market && odd.bookmaker === bookmaker,
    );

    if (filteredOdds.length === 0) {
      return null;
    }

    const odd = filteredOdds[0];

    for (const outcome of odd.outcomes) {
      if (
        this.matchesOutcome(
          outcome.name,
          selectedOutcome,
          game.homeTeam,
          game.awayTeam,
        )
      ) {
        return outcome.price;
      }
    }

    return null;
  }

  private matchesOutcome(
    outcomeName: string,
    selectedOutcome: BetOutcome,
    homeTeam: string,
    awayTeam: string,
  ): boolean {
    const normalizedOutcomeName = outcomeName.toLowerCase();

    switch (selectedOutcome) {
      case 'home':
        return normalizedOutcomeName.includes(homeTeam.toLowerCase());
      case 'away':
        return normalizedOutcomeName.includes(awayTeam.toLowerCase());
      case 'draw':
        return (
          normalizedOutcomeName.includes('draw') ||
          normalizedOutcomeName.includes('tie')
        );
      default:
        return false;
    }
  }
}
