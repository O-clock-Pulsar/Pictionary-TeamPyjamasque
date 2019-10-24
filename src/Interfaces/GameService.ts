import { IGame } from '../models/Game';

export interface IGameServiceResult {
  game: IGame;
  alreadyExists: boolean;
  message: string;
}

export interface IPlayerResult {
  playerList: Array<string>;
  ready: boolean
}
