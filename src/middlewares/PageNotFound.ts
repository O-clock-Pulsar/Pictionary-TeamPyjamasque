import { NextFunction, Request, Response } from 'express';

const pageNotFound = (request: Request, response: Response, next: NextFunction) => {
  response.statusCode = 404;
  response.render('./404');

  next();
};

export default pageNotFound;
