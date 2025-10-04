import { inject, injectable } from 'inversify';
import { BaseController } from '../../common/base.controller';
import { IUserController } from './user.controller.intreface';
import { TYPES } from '../../types';
import { ILogger } from '../../logger/logger.service';
import { IUserService } from '../service/user.service.intarface';
import { IConfigService } from '../../config/config.service.interface';
import { ValidateMiddleware } from '../../common/validate.middleware';
import { UserRegistrationDto } from '../dto/user-registration.dto';
import { UserLoginDto } from '../dto/user-login.dto';
import { Request, Response, NextFunction } from 'express';
import { HTTPError } from '../../errors/HttpError';

@injectable()
export class UserController extends BaseController implements IUserController {
  constructor(
    @inject(TYPES.LoggerService) private loggerService: ILogger,
    @inject(TYPES.UserService) private userService: IUserService,
    @inject(TYPES.ConfigService) private configService: IConfigService,
  ) {
    super(loggerService);

    this.bindRoutes([
      {
        path: '/registration',
        method: 'post',
        func: this.register,
        middlewares: [new ValidateMiddleware(UserRegistrationDto)],
      },
      {
        path: '/activate/:link',
        method: 'get',
        func: this.activate,
      },
      {
        path: '/login',
        method: 'post',
        func: this.login,
        middlewares: [new ValidateMiddleware(UserLoginDto)],
      },
      {
        path: '/logout',
        method: 'get',
        func: this.logout,
      },
      {
        path: '/refresh',
        method: 'get',
        func: this.refresh,
      },
    ]);
  }

  public async register(
    { body }: Request<{}, {}, UserRegistrationDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const result = await this.userService.create(body);

    if (!result) return next(new HTTPError(422, 'The user is already exists'));

    this.created(res);
  }

  public async activate(
    { params }: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const activateLink = params.link;
    console.log(activateLink);
    const tokens = await this.userService.activate(activateLink);

    if (!tokens) return next(new HTTPError(422, 'Invalid link'));

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    this.ok(res, { accessToken: tokens.accessToken });
  }

  public async login(
    { body }: Request<{}, {}, UserLoginDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const tokens = await this.userService.login(body);

    if (!tokens) return next(new HTTPError(422, 'Invalid email or password'));

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    this.ok(res, { accessToken: tokens.accessToken });
  }

  public async logout(
    { cookies }: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const refreshToken = cookies['refreshToken'];

    this.userService.logout(refreshToken);

    res.clearCookie('refreshToken');

    this.ok(res, 'logout');
  }

  public async refresh(
    { cookies }: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const refreshToken = cookies['refreshToken'];

    const accessToken = await this.userService.refresh(refreshToken);

    if (!accessToken) return next(new HTTPError(401, 'Not authorized'));

    res.send({ accessToken });
  }
}
