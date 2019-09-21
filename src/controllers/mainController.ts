import { Request, Response } from 'express';
import { promises } from 'fs';

export default class MainController {

  static home(request : Request, response: Response) {
    response.render('index');
  }

  static async reportViolation(request: Request, response: Response) {
    if (request.body) {
      const timestamp = new Date();
      await promises.writeFile(
        `${__dirname}../../../${timestamp}.txt`,
        request.body
      );
    }
  }

