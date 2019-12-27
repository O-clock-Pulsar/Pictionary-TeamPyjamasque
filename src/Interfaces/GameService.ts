import { IGame } from '../models/Game';

export interface IGameServiceResult {
  game: IGame;
  alreadyExists: boolean;
  message: string;
  namespace: string;
}

export interface IPlayerResult {
  playerList: Array<string>;
  ready: boolean;
}

export interface IRoleAssignment {
  drawer: string;
  answerers: string[];
}
