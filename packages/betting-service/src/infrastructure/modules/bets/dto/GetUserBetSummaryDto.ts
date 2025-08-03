import { IsString, IsNotEmpty } from 'class-validator';

export class GetUserBetSummaryDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
