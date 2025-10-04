import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../common/base.controller';
import { IPostController } from './post.controller.interface';
import { inject, injectable } from 'inversify';
import { ILogger } from '../../logger/logger.service';
import { TYPES } from '../../types';
import { ValidateMiddleware } from '../../common/validate.middleware';
import { PostCreateDto } from '../dto/post-create.dto';
import { PostGetDto } from '../dto/post-get.dto';
import { AuthMiddleware } from '../../common/auth.middleware';
import { IConfigService } from '../../config/config.service.interface';
import { IPostService } from '../service/post.service.interface';
import { HTTPError } from '../../errors/HttpError';

@injectable()
export class PostController extends BaseController implements IPostController {
  constructor(
    @inject(TYPES.LoggerService) private loggerService: ILogger,
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.PostService) private postService: IPostService,
  ) {
    super(loggerService);

    this.bindRoutes([
      {
        path: '/create',
        method: 'put',
        func: this.create,
        middlewares: [
          new ValidateMiddleware(PostCreateDto),
          new AuthMiddleware(this.configService.get('JWT_ACCESS_SECRET')),
        ],
      },
      {
        path: '/get',
        method: 'post',
        func: this.get,
        middlewares: [new ValidateMiddleware(PostGetDto)],
      },
      {
        path: '/getAll',
        method: 'get',
        func: this.getAll,
      },
    ]);
  }

  public async create(
    { body }: Request<{}, {}, PostCreateDto>,
    res: Response,
  ): Promise<void> {
    await this.postService.create(body);

    this.created(res);
  }

  public async get(
    { body }: Request<{}, {}, PostGetDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const post = await this.postService.findById(body.id);

    if (!post) return next(new HTTPError(404, 'The post does not exist'));

    this.send(res, 200, post);
  }

  public async getAll(_: Request, res: Response): Promise<void> {
    const posts = await this.postService.findAll();

    const statusCode: number = posts.length > 0 ? 200 : 205;

    this.send(res, statusCode, posts);
  }
}
