import { IGame } from '../models/Game';

export interface GameServiceResult {
  game: IGame;
  alreadyExists: boolean;
  message: string;
}
