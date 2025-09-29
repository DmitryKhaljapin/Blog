import { JwtPayload, sign } from 'jsonwebtoken';
import { Token } from '../token.entity';
import { ITokens, ITokenService } from './token.service.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { IConfigService } from '../../config/config.service.interface';
import { ITokenRepository } from '../repository/token.repository.interface';

injectable();
export class TokenService implements ITokenService {
  constructor(
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.TokenRepository) private tokenRepository: ITokenRepository,
  ) {}

  public generateTokens(payload: JwtPayload): ITokens {
    const accessToken = sign(
      payload,
      this.configService.get('JWT_ACCESS_SECRET'),
      { expiresIn: '15m' },
    );

    const refreshToken = sign(
      payload,
      this.configService.get('JWT_REFRESH_SECRET'),
      { expiresIn: '1d' },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  public async saveToken(token: Token): Promise<boolean> {
    const existingToken = await this.tokenRepository.findByRefreshToken(token);

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
    const existingToken = await this.tokenRepository.findByRefreshToken(token);

    if (!existingToken) return false;

    return true;
  }
}
