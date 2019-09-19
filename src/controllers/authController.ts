import {Request, Response} from 'express';
import { Container } from 'typedi';
import UserService from '../services/UserService';
import { UserServiceResults } from '../Interfaces/UserService';

const userService = Container.get(UserService);

export default class AuthController {

  static getLogin(request : Request, response: Response) {
    response.render('registration-form', {login: true});
  }

  static async postLogin(request: Request, response: Response){
      let {username, password} = request.body;
      username = username.trim();
      password = password.trim();
      let result: UserServiceResults = await userService.authenticateUser(username, password);
      if(result.error){
        request.flash("danger", result.message, false);
        response.redirect('/login');
      }
      request.session.username = username.name;
      response.redirect('/home');
  }

}