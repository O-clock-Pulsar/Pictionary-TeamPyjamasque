import {Request, Response} from 'express';

export default class MainController {

  static home(request : Request,response: Response) {
    response.render('index');
  }

}