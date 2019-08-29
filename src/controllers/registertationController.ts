import {Request, Response} from 'express';

export default class RegistrationController {

  static getRegister(request : Request, response: Response) {
    response.render('registration-form');
  }

  static postRegister(request: Request, response: Response){
      console.log(request.body);
  }

}