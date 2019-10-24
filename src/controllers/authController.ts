import { Request, Response } from 'express';
import { Container } from 'typedi';
import jsonwebtoken from 'jsonwebtoken';
import UserService from '../services/UserService';
import { IUserServiceResults } from '../Interfaces/UserService';

const userService = Container.get(UserService);

export default class AuthController {
  static getLogin(request : Request, response: Response) {
    response.render('user-form',
      { login: true });
  }

  static async postLogin(request: Request, response: Response) {
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
}
