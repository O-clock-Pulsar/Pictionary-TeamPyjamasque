import { IGame } from '../models/Game';

export interface GameServiceResult {
  game: IGame;
  alreadyExists: boolean;
  message: string;
}

export interface PlayerResult{
  playerList: Array<string>;
  ready: boolean
}
