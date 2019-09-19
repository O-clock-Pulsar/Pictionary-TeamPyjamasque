import {Request, Response} from 'express';
import { Container } from 'typedi';
import UserService from '../services/UserService';
import {IRegistrationResult, IAvatarResult} from '../Interfaces/UserService'

const userService = Container.get(UserService);
export default class RegistrationController {

  static getRegister(request : Request, response: Response) {
    const pugVariables = request.session.registrationErrors;
    delete request.session.registrationErrors;
    response.render('registration-form', pugVariables);
  }

  static async postRegister(request: Request, response: Response) {
    const formData = request.body;
    const avatarData = request.file;
    const result: IRegistrationResult = await userService.createUser(formData);
    if (result.error){
      let pugVariables = {};
      result.ids.forEach(id => pugVariables[`${id}Error`] = true);
      result.messages.forEach(message => request.flash("danger", message, false))
      request.session.registrationErrors = pugVariables;
      response.redirect('/register');
    } else {
    if(avatarData){
        let avatarResult: IAvatarResult = await userService.uploadAvatar(avatarData, result.user);
        if (avatarResult.error){
          request.flash("danger", avatarResult.message, false);
          response.redirect('/login');
        }
      }
      request.flash("success", result.messages[0], false); 
      response.redirect('/login');
    }
  }

}