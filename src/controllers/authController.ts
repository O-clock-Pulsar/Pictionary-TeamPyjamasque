import { Request, Response } from 'express';
import { Container } from 'typedi';
import jsonwebtoken from 'jsonwebtoken';
import UserService from '../services/UserService';
import { IUserServiceResults } from '../Interfaces/UserService';

const userService = Container.get(UserService);

export default class AuthController {
  static getLogin(request : Request, response: Response): void {
    response.render('user-form',
      { login: true });
  }

  static async postLogin(request: Request, response: Response): Promise<void> {
    const { username, password } = request.body;
    const result: IUserServiceResults = await userService.authenticateUser(username,
      password);
    if (result.error) {
      request.flash('danger',
        result.message,
        false);
      response.redirect('/login');
    }
    const token: string = jsonwebtoken.sign({ username },
      process.env.JWT_SECRET || 'dummy',
      { expiresIn: '24h' });
    response.cookie('token',
      token);
    response.redirect('/home');
  }

  static getLogout(request : Request, response: Response): void {
    response.clearCookie('token');
    response.redirect('/');
  }

  static getAuthentificate(request: Request, response: Response) {
    try {
      const decodedToken: any = jsonwebtoken.verify(request.params.token,
        process.env.JWT_SECRET || 'dummy');
      response.json(JSON.stringify(decodedToken));
    } catch {
      response.json({});
    }
  }
}
