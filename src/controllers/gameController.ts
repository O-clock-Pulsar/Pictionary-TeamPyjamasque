import { Request, Response } from 'express';
import { Container } from 'typedi';
import jsonwebtoken from 'jsonwebtoken';
import GameService from '../services/GameService';
import { IGameServiceResult } from '../Interfaces/GameService';

const gameService = Container.get(GameService);

export default class GameController {
  static async create(request: Request, response: Response): Promise<void> {
    // Type must be any or throws an error
    const token: any = await jsonwebtoken.verify(
      request.cookies.token,
      process.env.JWT_SECRET || 'dummy',
    );
    const { username } = token;
    const result: IGameServiceResult = await gameService.createGame(username);
    const { alreadyExists, namespace, message } = result;
    if (!alreadyExists) {
      const io = request.app.get('socketio');
      io.createNamespace(namespace);
    }
    response.cookie('flashIsDanger',
      alreadyExists);
    response.cookie('flashMessage',
      message);
    response.redirect(`/game/${namespace}`);
  }

  static async showGames(request: Request, response: Response): Promise<void> {
    const availableGames = await gameService.getCurrentGames();
    const games = availableGames.map((game) => {
      const { namespace } = game;
      const { host } = game;
      const { players } = game;
      // Arbitrary number for now
      const placesLeft = 4 - game.players.length;
      const startTime = `${game.date.getDate()}/${game.date.getMonth()
        + 1}/${game.date.getFullYear()} ${game.date.getHours()}:${game.date.getMinutes()}:${game.date.getSeconds()}`;
      return {
        namespace,
        host,
        players,
        placesLeft,
        startTime,
      };
    });
    response.render('game-list',
      { games });
  }

  static play(request: Request, response: Response): void {
    response.cookie('namespace',
      request.params.namespace);
    if (process.env.NODE_ENV === 'production') {
      response.redirect('/react');
    } else response.redirect('http://localhost:3000');
  }

  static checkWord(request: Request, response: Response): void {
    const io = request.app.get('socketio');
    const input = request.params.word;
    const roundWord = io.namespaces[request.params.namespace].word;
    const compareResult = input.localeCompare(roundWord,
      'fr',
      { sensitivity: 'base' });
    if (compareResult === 0) {
      response.json(JSON.stringify({ correct: true }));
    } else response.json(JSON.stringify({ correct: false }));
  }
}
