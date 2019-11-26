import { Request, Response } from 'express';
import User from '../models/User';
import jsonwebtoken from'jsonwebtoken';

export default class UserController {

  static async getProfile(request:Request,response: Response): Promise<void> {
    const { token } = request.cookies;
    if (token) {
      try {
        // Must be any or throws an error
        const decodedToken: any = jsonwebtoken.verify(token,
          process.env.JWT_SECRET || 'dummy');
       if (decodedToken.username) {
  
        const username = decodedToken.username;
        const user = await User.findOne({username});

       return response.render('profile', {user});
  
      }} catch (e) {
        request.flash('danger',
          "Votre identité n'a pas pu être confirmé. Veuillez se reconnecter.",
          false);
         
        response.redirect('/');
      }
    } 
  
    }
  }
  


