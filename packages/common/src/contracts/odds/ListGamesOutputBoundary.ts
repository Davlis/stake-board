export interface GameData {
  id: string;
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  status: string;
  commenceTime: Date;  
  result: string;
}

export type ListGamesOutputBoundary = GameData[];
