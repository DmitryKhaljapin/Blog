import { JwtPayload, sign } from 'jsonwebtoken';
import { Token } from '../token.entity';
import { ITokens, ITokenService } from './token.service.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { IConfigService } from '../../config/config.service.interface';
import { ITokenRepository } from '../repository/token.repository.interface';
import { TokenModel } from '@prisma/client';

injectable();
export class TokenService implements ITokenService {
  constructor(
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.TokenRepository) private tokenRepository: ITokenRepository,
  ) {}

  public generateTokens(payload: JwtPayload): ITokens {
    const accessToken = sign(
      {
        iat: Math.floor(Date.now() / 1000),
        ...payload,
      },
      this.configService.get('JWT_ACCESS_SECRET'),
      { algorithm: 'HS256', expiresIn: '15m' },
    );

    const refreshToken = sign(
      {
        iat: Math.floor(Date.now() / 1000),
        ...payload,
      },
      this.configService.get('JWT_REFRESH_SECRET'),
      { algorithm: 'HS256', expiresIn: '1d' },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  public generateAccessToken(payload: JwtPayload): string {
    const accessToken = sign(
      {
        iat: Math.floor(Date.now() / 1000),
        ...payload,
      },
      this.configService.get('JWT_ACCESS_SECRET'),
      { algorithm: 'HS256', expiresIn: '15m' },
    );

    return accessToken;
  }

  public async saveToken(token: Token): Promise<boolean> {
    const existingToken = await this.tokenRepository.findByRefreshToken(
      token.refreshToken,
    );

    if (existingToken) {
      await this.tokenRepository.update(token);

      return true;
    }

    return this.tokenRepository.create(token);
  }

  public async removeToken(token: Token): Promise<void> {
    this.tokenRepository.remove(token);
  }

  public async isTokenExisting(token: Token): Promise<boolean> {
    // remove
    const existingToken = await this.tokenRepository.findByRefreshToken(
      token.refreshToken,
    );

    if (!existingToken) return false;

    return true;
  }

  public async findToken(refreshToken: string): Promise<TokenModel | null> {
    return await this.tokenRepository.findByRefreshToken(refreshToken);
  }
}
