import {Request, Response, NextFunction} from 'express';

const permittedRoutes = ["/login", "/", "/register"];

export default function (request: Request, response: Response, next: NextFunction) {
    if (request.session.username || permittedRoutes.includes(request.url) ) {
        next();
    } else {
        request.flash("danger", "Vous n'êtes pas connecté.", false); 
        response.redirect('/');
    }
}