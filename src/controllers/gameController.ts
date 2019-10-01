import { Request, Response } from 'express';
import { Container } from 'typedi';
import jsonwebtoken from 'jsonwebtoken';
import GameService from '../services/GameService';
import Game from '../models/Game';

const gameService = Container.get(GameService);

export default class GameController {
  static async create(request: Request, response: Response) {
    // Type must be any or throws an error
    const token: any = await jsonwebtoken.verify(
      request.cookies.token,
      'dummy' || process.env.JWT_SECRET,
    );
    const { username } = token;
    const result = await gameService.createGame(username);
    const { namespace } = result.game;
    request.flash(result.alreadyExists ? 'danger' : 'success',
      result.message,
      false);
    response.redirect(`/game/${namespace}`);
  }

  static async showGames(request: Request, response: Response) {
    const availableGames = await Game.find({ namespace: { $ne: null } });
    if (availableGames.length === 0) {
      response.render('no-games');
    } else {
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
  }

  static play(request: Request, response: Response) {
    const { namespace } = request.params;
    response.render('play',
      { namespace });
  }
}
