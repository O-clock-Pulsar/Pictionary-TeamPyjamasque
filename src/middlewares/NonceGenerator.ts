import { NextFunction, Request, Response } from 'express';
import uuid from 'uuid/v1';

export default function (request: Request, response: Response, next: NextFunction): void {
  response.locals.nonce = uuid();
  next();
}
