import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import { Server } from 'http';
import { injectable } from 'inversify';
import cors from 'cors';

@injectable()
export class App {
  app: Express;
  server: Server;
  port: number;

  constructor() {
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
  }
}
