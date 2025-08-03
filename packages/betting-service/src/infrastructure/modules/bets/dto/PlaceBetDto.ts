import { IsIn, IsNumber, IsString, Min } from 'class-validator';

export class PlaceBetDto {
  @IsString()
  userId: string;

  @IsString()
  gameId: string;

  @IsIn(['home', 'away', 'draw'])
  selectedOutcome: 'home' | 'away' | 'draw';

  @IsNumber()
  @Min(1)
  amount: number;

  @IsString()
  market: string;

  @IsString()
  bookmaker: string;
}
