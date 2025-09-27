import { inject, injectable } from 'inversify';
import { IExeptionFilter } from './exeption.filter.interface';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.service';
import { HTTPError } from './HttpError';
import { NextFunction, Request, Response } from 'express';

@injectable()
export class ExeptionFilter implements IExeptionFilter {
  constructor(@inject(TYPES.LoggerService) private logger: ILogger) {}

  public catch(
    err: HTTPError,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    this.logger.error(
      `[${err.context}] Error ${err.statusCode}: ${err.message}`,
    );
    res.status(err.statusCode).send({ err: err.message });
  }
}
