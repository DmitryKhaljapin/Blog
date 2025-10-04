import { NextFunction, Request, Response, Router } from 'express';

export interface IPostController {
  router: Router;
  create(req: Request, res: Response, next: NextFunction): Promise<void>;
  get(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
}
