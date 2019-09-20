import {Request, Response} from 'express';
import { Container } from 'typedi';
import UserService from '../services/UserService';
import { UserServiceResults } from '../Interfaces/UserService';
import jsonwebtoken from 'jsonwebtoken';

const userService = Container.get(UserService);

export default class AuthController {

  static getLogin(request : Request, response: Response) {
    response.render('user-form', {login: true});
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
      const token = jsonwebtoken.sign({username: username}, process.env.JWT_SECRET || 'dummy', {expiresIn: '24h'});
      response.cookie('token', token);
      response.redirect('/home');
  }

}