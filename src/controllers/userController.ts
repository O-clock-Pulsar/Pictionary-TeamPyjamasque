import { Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import User from '../models/User';

export default class UserController {
  static async getProfile(request:Request, response: Response): Promise<void> {
    const { token } = request.cookies;
    if (token) {
      try {
        // Must be any or throws an error
        const decodedToken: any = jsonwebtoken.verify(token,
          process.env.JWT_SECRET || 'dummy');
        if (decodedToken.username) {
          const { username } = decodedToken;
          const user = await User.findOne({ username });

          return response.render('profile',
            { user });
        }
      } catch (e) {
        request.flash('danger',
          "Votre identité n'a pas pu être confirmée. Veuillez se reconnecter.",
          false);

        response.redirect('/');
      }
    }
  }
}
