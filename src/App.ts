import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import cors from 'cors';
import { ILogger } from './logger/logger.service';
import { TYPES } from './types';

@injectable()
export class App {
  app: Express;
  server: Server;
  port: number;

  constructor(@inject(TYPES.LoggerService) private logger: ILogger) {
    this.app = express();
    this.port = 3000; // use config servise here
  }

  public useMiddleware() {
    this.app.use(json());
    this.app.use(cookieParser());
    this.app.use(cors());
  }

  public useRoutes() {}

  public async usePrismaService() {}

  public async init() {
    this.useMiddleware();
    this.useRoutes();

    this.usePrismaService();

    this.server = this.app.listen(this.port);

    this.logger.log(`The server has stated on the port ${this.port}`);
  }
}
