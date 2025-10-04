import { PostRepository } from './post/repository/post.repository';

export const TYPES = {
  Application: Symbol.for('Application'),
  LoggerService: Symbol.for('LoggerService'),
  ExeptionFilter: Symbol.for('ExeptionFilter'),
  ConfigService: Symbol.for('ConfigSevice'),
  PrismaService: Symbol.for('PrismaService'),

  TokenRepository: Symbol.for('TokenRepository'),
  TokenService: Symbol.for('TokenService'),

  MailService: Symbol.for('MailService'),

  UserRepository: Symbol.for('UserRepository'),
  UserService: Symbol.for('UserService'),
  UserController: Symbol.for('UserController'),

  PostRepository: Symbol.for('PostRepository'),
  PostService: Symbol.for('PostService'),
  PostController: Symbol.for('PostController'),
};
