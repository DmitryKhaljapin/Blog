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

export const appBindings = new ContainerModule(
  (options: ContainerModuleLoadOptions) => {
    options.bind<App>(TYPES.Application).to(App);
    options.bind<ILogger>(TYPES.LoggerService).to(LoggerService);
    options.bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
  },
);

function bootstrap() {
  const appContainer = new Container();
  appContainer.load(appBindings);

  const app = appContainer.get<App>(TYPES.Application);
  app.init();
}

bootstrap();
