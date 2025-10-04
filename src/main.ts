import {
  Container,
  ContainerModule,
  ContainerModuleLoadOptions,
} from 'inversify';
import { App } from './App';
import { TYPES } from './types';
import { ILogger } from './logger/logger.service';
import { LoggerService } from './logger/logger.service.inteface';
import { IExeptionFilter } from './errors/exeption.filter.interface';
import { ExeptionFilter } from './errors/exeption.filter';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';
import { IDatabaseService } from './database/database.service.interface';
import { PrismaService } from './database/prisma.service';
import { ITokenRepository } from './token/repository/token.repository.interface';
import { TokenRepository } from './token/repository/token.repository';
import { ITokenService } from './token/service/token.service.interface';
import { TokenService } from './token/service/token.service';
import { IMailService } from './mail/mail.service.interface';
import { MailService } from './mail/mail.service';
import { IUserRepository } from './user/repository/user.repository.interface';
import { UserRepository } from './user/repository/user.repository';
import { IUserService } from './user/service/user.service.intarface';
import { UserService } from './user/service/user.service';
import { IUserController } from './user/controller/user.controller.intreface';
import { UserController } from './user/controller/user.controller';
import { IPostRepository } from './post/repository/post.repository.interface';
import { PostRepository } from './post/repository/post.repository';
import { IPostService } from './post/service/post.service.interface';
import { PostService } from './post/service/post.service';
import { IPostController } from './post/controller/post.controller.interface';
import { PostController } from './post/controller/post.controller';

export const appBindings = new ContainerModule(
  (options: ContainerModuleLoadOptions) => {
    options.bind<App>(TYPES.Application).to(App);
    options.bind<ILogger>(TYPES.LoggerService).to(LoggerService);
    options.bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
    options.bind<IConfigService>(TYPES.ConfigService).to(ConfigService);
    options
      .bind<IDatabaseService>(TYPES.PrismaService)
      .to(PrismaService)
      .inSingletonScope();
    options
      .bind<ITokenRepository>(TYPES.TokenRepository)
      .to(TokenRepository)
      .inSingletonScope();
    options.bind<ITokenService>(TYPES.TokenService).to(TokenService);
    options.bind<IMailService>(TYPES.MailService).to(MailService);
    options
      .bind<IUserRepository>(TYPES.UserRepository)
      .to(UserRepository)
      .inSingletonScope();
    options.bind<IUserService>(TYPES.UserService).to(UserService);
    options.bind<IUserController>(TYPES.UserController).to(UserController);
    options
      .bind<IPostRepository>(TYPES.PostRepository)
      .to(PostRepository)
      .inSingletonScope();
    options.bind<IPostService>(TYPES.PostService).to(PostService);
    options.bind<IPostController>(TYPES.PostController).to(PostController);
  },
);

function bootstrap() {
  const appContainer = new Container();
  appContainer.load(appBindings);

  const app = appContainer.get<App>(TYPES.Application);
  app.init();
}

bootstrap();
