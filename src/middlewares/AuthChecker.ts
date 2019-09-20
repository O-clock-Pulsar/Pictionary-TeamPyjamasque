import {Request, Response, NextFunction} from 'express';
import jsonwebtoken from 'jsonwebtoken';

const permittedRoutes = ["/login", "/", "/register"];

export default function (request: Request, response: Response, next: NextFunction) {
    if (permittedRoutes.includes(request.url) ) {
        next();
    } else {
        const token = request.cookies.token;
        if (token) {
            try{
                const decodedToken: any = jsonwebtoken.verify(token, 'dummy' || process.env.JWT_SECRET);
                if (decodedToken.username){
                    next();
                }
            } catch (e){
                request.flash("danger", "Votre identité n'a pas pu être confirmé. Veuillez se reconnecter.", false); 
                response.redirect('/login');
            }
        } else{
            request.flash("danger", "Vous n'êtes pas connecté.", false); 
            response.redirect('/login');
        }
    }
}