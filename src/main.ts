import {
  Container,
  ContainerModule,
  ContainerModuleLoadOptions,
} from 'inversify';
import { App } from './App';
import { TYPES } from './types';

export const appBindings = new ContainerModule(
  (options: ContainerModuleLoadOptions) => {
    options.bind<App>(TYPES.Application).to(App);
  },
);

function bootstrap() {
  const appContainer = new Container();
  appContainer.load(appBindings);

  const app = appContainer.get<App>(TYPES.Application);
  app.init();

  return { appContainer, app };
}

export const { app, appContainer } = bootstrap();
