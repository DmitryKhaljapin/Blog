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
  },
);

function bootstrap() {
  const appContainer = new Container();
  appContainer.load(appBindings);

  const app = appContainer.get<App>(TYPES.Application);
  app.init();
}

bootstrap();
