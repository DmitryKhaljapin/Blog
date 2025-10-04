import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import cors from 'cors';
import { ILogger } from './logger/logger.service';
import { TYPES } from './types';
import { IConfigService } from './config/config.service.interface';
import { IDatabaseService } from './database/database.service.interface';
import { IUserController } from './user/controller/user.controller.intreface';
import { IPostController } from './post/controller/post.controller.interface';

@injectable()
export class App {
  app: Express;
  server: Server;
  port: number;

  constructor(
    @inject(TYPES.LoggerService) private logger: ILogger,
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.PrismaService) private prismaService: IDatabaseService,
    @inject(TYPES.UserController) private userController: IUserController,
    @inject(TYPES.PostController) private postController: IPostController,
  ) {
    this.app = express();
    this.port = Number(this.configService.get('PORT'));
  }

  public useMiddleware() {
    this.app.use(json());
    this.app.use(cookieParser());
    this.app.use(cors());
  }

  public useRoutes() {
    this.app.use('/api', this.userController.router);
    this.app.use('/api/posts', this.postController.router);
  }

  public async usePrismaService() {
    await this.prismaService.connect();
  }

  public async init() {
    this.useMiddleware();
    this.useRoutes();

    this.usePrismaService();

    this.server = this.app.listen(this.port);

    this.logger.log(`The server has stated on the port ${this.port}`);
  }
}
