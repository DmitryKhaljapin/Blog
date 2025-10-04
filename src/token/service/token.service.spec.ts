import { Container } from 'inversify';
import { IConfigService } from '../../config/config.service.interface';
import { ITokenRepository } from '../repository/token.repository.interface';
import { ITokenService } from './token.service.interface';
import { TYPES } from '../../types';
import { TokenService } from './token.service';
import { JwtPayload } from 'jsonwebtoken';
import { TokenModel } from '@prisma/client';
import { Token } from '../token.entity';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockImplementation((_, secret) => {
    return `${secret}-token`;
  }),
}));

const ConfigServiceMock: IConfigService = {
  get: jest.fn(),
};

const TokenRepositoryMock: ITokenRepository = {
  create: jest.fn().mockReturnValue(true),
  update: jest.fn().mockResolvedValue(true),

  findByRefreshToken: jest.fn(),
  findByUserId: jest.fn(),

  remove: jest.fn(),
};

const mockTokenModel: TokenModel = {
  id: 1,
  refreshToken: 'refresh123',
  userId: 123,
};

const mockToken: Token = {
  refreshToken: 'refresh123',
  userId: 123,
} as Token;

const container = new Container();
let configService: IConfigService;
let tokenRepository: ITokenRepository;
let tokenService: ITokenService;

beforeAll(() => {
  container.bind<TokenService>(TYPES.TokenService).to(TokenService);
  container
    .bind<IConfigService>(TYPES.ConfigService)
    .toConstantValue(ConfigServiceMock);
  container
    .bind<ITokenRepository>(TYPES.TokenRepository)
    .toConstantValue(TokenRepositoryMock);

  configService = container.get<IConfigService>(TYPES.ConfigService);
  tokenRepository = container.get<ITokenRepository>(TYPES.TokenRepository);

  tokenService = container.get<ITokenService>(TYPES.TokenService);
});

describe('Toke Service', () => {
  it('generateTokens', () => {
    configService.get = jest.fn().mockImplementation((key: string) => {
      if (key === 'JWT_ACCESS_SECRET') return 'access-secret';
      if (key === 'JWT_REFRESH_SECRET') return 'refresh-secret';
      return '';
    });
    const payload: JwtPayload = { email: 'test@test.ts' };

    const tokens = tokenService.generateTokens(payload);

    expect(tokens).toHaveProperty('accessToken', 'access-secret-token');
    expect(tokens).toHaveProperty('refreshToken', 'refresh-secret-token');
  });

  describe('saveToken', () => {
    it('updates token if it exists', async () => {
      tokenRepository.findByUserId = jest.fn().mockReturnValue(mockTokenModel);

      const token = { refreshToken: 'refresh123', userId: 123 } as Token;

      const result = await tokenService.saveToken(token);

      expect(tokenRepository.update).toHaveBeenCalledWith(mockToken);
      expect(result).toBe(true);
    });

    it('creates token if it does not exist', async () => {
      tokenRepository.findByUserId = jest.fn().mockResolvedValue(null);

      const result = await tokenService.saveToken(mockToken);

      expect(tokenRepository.create).toHaveBeenCalledWith(mockToken);
      expect(result).toBe(true);
    });
  });

  describe('isTokenExisting', () => {
    it('should return true if token exists', async () => {
      tokenRepository.findByRefreshToken = jest
        .fn()
        .mockResolvedValue(mockTokenModel);

      const result = await tokenService.isTokenExisting(mockToken);

      expect(result).toBe(true);
    });

    it('should return false if token does not exist', async () => {
      tokenRepository.findByRefreshToken = jest.fn().mockResolvedValue(null);

      const result = await tokenService.isTokenExisting(mockToken);

      expect(result).toBe(false);
    });
  });
});
