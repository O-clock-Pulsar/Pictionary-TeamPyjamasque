import {Request, Response} from 'express';
import { Container } from 'typedi';
import UserService from '../services/UserService';
import {IRegistrationResult} from '../Interfaces/UserService'

const userService = Container.get(UserService);
export default class RegistrationController {

  static getRegister(request : Request, response: Response) {
    response.render('registration-form');
  }

  static async postRegister(request: Request, response: Response) {
    const formData = request.body;
    const results = await userService.createUser(formData);
    
  }

}