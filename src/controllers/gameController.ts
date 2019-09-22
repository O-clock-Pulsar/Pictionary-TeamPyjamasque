import { Request, Response } from 'express';
import { Container } from 'typedi';
import jsonwebtoken from 'jsonwebtoken';
import GameService from '../services/GameService';

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
    request.flash(result.alreadyExists ? 'danger' : 'success', result.message, false);
    response.redirect(`/game/play/${namespace}`);
  }
}
