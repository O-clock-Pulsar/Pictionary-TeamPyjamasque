import { Request, Response } from 'express';
import { promises } from 'fs';

export default class MainController {
  static home(request: Request, response: Response): void {
    response.render('index');
  }

  static async reportViolation(request: Request, response: Response): void {
    if (request.body) {
      const timestamp = new Date();
      await promises.writeFile(
        `${__dirname}../../../${timestamp}.txt`,
        request.body
      );
    }
  }
}
