import { Container } from 'inversify';
import { IConfigService } from '../../config/config.service.interface';
import { IMailService } from '../../mail/mail.service.interface';
import { ITokenService } from '../../token/service/token.service.interface';
import { IUserRepository } from '../repository/user.repository.interface';
import { IUserService } from './user.service.intarface';
import { TYPES } from '../../types';
import { UserService } from './user.service';
import { User } from '../user.entity';
import { UserModel } from '@prisma/client';
import { Token } from '../../token/token.entity';

const ConfigServiceMock: IConfigService = {
  get: jest.fn(),
};

const UserRepositoryMock: IUserRepository = {
  create: jest.fn(),
  update: jest.fn(),

  findByEmail: jest.fn(),
  findById: jest.fn(),
  findByActivationLink: jest.fn(),
};

const MailServiceMock: IMailService = {
  sendActivationLink: jest.fn(),
};

const TokenServiceMock: ITokenService = {
  generateTokens: jest.fn().mockReturnValue({
    accessToken: 'access',
    refreshToken: 'refresh',
  }),
  generateAccessToken: jest.fn().mockReturnValueOnce('newAccess'),
  saveToken: jest.fn(),
  removeToken: jest.fn(),
  isTokenExisting: jest.fn(),
  findToken: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let userRepository: IUserRepository;
let mailService: IMailService;
let tokenService: ITokenService;

let userService: IUserService;

beforeAll(() => {
  container.bind<IUserService>(TYPES.UserService).to(UserService);

  container
    .bind<IConfigService>(TYPES.ConfigService)
    .toConstantValue(ConfigServiceMock);
  container
    .bind<IUserRepository>(TYPES.UserRepository)
    .toConstantValue(UserRepositoryMock);
  container
    .bind<IMailService>(TYPES.MailService)
    .toConstantValue(MailServiceMock);
  container
    .bind<ITokenService>(TYPES.TokenService)
    .toConstantValue(TokenServiceMock);

  configService = container.get<IConfigService>(TYPES.ConfigService);
  userRepository = container.get<IUserRepository>(TYPES.UserRepository);
  mailService = container.get<IMailService>(TYPES.MailService);
  tokenService = container.get<ITokenService>(TYPES.TokenService);

  userService = container.get<IUserService>(TYPES.UserService);
});

jest.mock('uuid', () => ({ v4: jest.fn(() => 'uuid-mock') }));

describe('User Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('returns false if a user already exists', async () => {
      userRepository.findByEmail = jest.fn().mockResolvedValueOnce({ id: 1 });

      const result = await userService.create({
        email: 'test@example.com',
        name: 'Test',
        password: '123',
      });

      expect(result).toBe(false);
    });

    it('creates a new user if the user does not exists', async () => {
      userRepository.findByEmail = jest.fn().mockResolvedValueOnce(null);
      configService.get = jest
        .fn()
        .mockReturnValueOnce('10') // SALT
        .mockReturnValueOnce('https://test-host.test'); // API_URL

      jest.spyOn(User.prototype, 'setPassword').mockResolvedValue();

      const result = await userService.create({
        email: 'test@example.com',
        name: 'Test',
        password: '12345',
      });

      expect(result).toBe(true);
      expect(mailService.sendActivationLink).toHaveBeenCalledWith(
        'test@example.com',
        'https://test-host.test/api/activate/uuid-mock',
      );
    });
  });

  describe('login', () => {
    it('returns null if a user does not exist', async () => {
      userRepository.findByEmail = jest.fn().mockResolvedValueOnce(null);

      const result = await userService.login({
        email: 'test',
        password: '123',
      });

      expect(result).toBeNull();
    });

    it('returns null if a user is invalid', async () => {
      userRepository.findByEmail = jest.fn().mockResolvedValueOnce({
        id: 1,
        email: 'test',
        name: 'Test',
        password: 'hashed',
      });

      jest
        .spyOn(User.prototype, 'comparePassword')
        .mockResolvedValueOnce(false);

      const result = await userService.login({
        email: 'test',
        password: 'wrong',
      });
      expect(result).toBeNull();
    });

    it('return tokens if a user is valid', async () => {
      userRepository.findByEmail = jest.fn().mockResolvedValueOnce({
        id: 1,
        email: 'test@example.com',
        name: 'Test',
        password: 'hashed',
      });

      jest.spyOn(User.prototype, 'comparePassword').mockResolvedValueOnce(true);

      tokenService.saveToken = jest.fn().mockResolvedValueOnce(true);

      const result = await userService.login({
        email: 'test@example.com',
        password: '123',
      });

      expect(result).toEqual({
        accessToken: 'access',
        refreshToken: 'refresh',
      });
    });
  });

  describe('logout', () => {
    it('removes a refresh token', async () => {
      await userService.logout('refresh123');

      expect(tokenService.removeToken).toHaveBeenCalled();
    });

    it('does not remove a refresh token if it is not provided', async () => {
      await userService.logout('');

      expect(tokenService.removeToken).not.toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('return null if a refresh token is not provided', async () => {
      const result = await userService.refresh('');

      expect(result).toBeNull();
    });

    it('returns null if a refresh token does not exist', async () => {
      tokenService.findToken = jest.fn().mockResolvedValueOnce(null);

      const result = await userService.refresh('refreshToken');

      expect(result).toBeNull();
    });

    it('returns an accessToken if a refreshToken is valid', async () => {
      tokenService.findToken = jest.fn().mockResolvedValueOnce({
        refreshToken: 'refresh',
        userId: 1,
      });

      jest
        .spyOn(Token.prototype, 'validateRefreshToken')
        .mockResolvedValueOnce(true);

      userRepository.findById = jest.fn().mockResolvedValueOnce({
        id: 1,
        email: 'test@example.com',
      } as any);

      const result = await userService.refresh('refresh');
      expect(result).toBe('newAccess');
    });
  });

  describe('activate', () => {
    it('returns null if a user does not exist', async () => {
      userRepository.findByActivationLink = jest
        .fn()
        .mockResolvedValueOnce(null);

      const result = await userService.activate('link');

      expect(result).toBeNull();
    });

    it('activats a user and returs tokens if a user is valid', async () => {
      userRepository.findByActivationLink = jest.fn().mockResolvedValueOnce({
        id: 1,
        email: 'test@example.com',
        name: 'Test',
        password: 'hash',
      });

      const result = await userService.activate('link123');

      expect(result).toEqual({
        accessToken: 'access',
        refreshToken: 'refresh',
      });

      expect(userRepository.update).toHaveBeenCalled();
      expect(tokenService.saveToken).toHaveBeenCalled();
    });
  });
});
