import {Request, Response} from 'express';
import { Container } from 'typedi';
import UserService from '../services/UserService';
import {IRegistrationResult} from '../Interfaces/UserService'

const userService = Container.get(UserService);
export default class RegistrationController {

  static getRegister(request : Request, response: Response) {
    const pugVariables = request.session.registrationErrors;
    delete request.session.registrationErrors;
    response.render('registration-form', pugVariables);
  }

  static async postRegister(request: Request, response: Response) {
    delete request.session.registrationErrors;
    const formData = request.body;
    const results: IRegistrationResult = await userService.createUser(formData);
    if (results.error){
      let pugVariables = {};
      results.ids.forEach(id => pugVariables[`${id}Error`] = true);
      results.messages.forEach(message => request.flash("danger", message, false))
      request.session.registrationErrors = pugVariables;
      response.redirect('/register');
    } else response.redirect('/login');
  }

}