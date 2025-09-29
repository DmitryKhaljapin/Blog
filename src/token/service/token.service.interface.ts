import { JwtPayload } from 'jsonwebtoken';
import { Token } from '../token.entity';

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface ITokenService {
  generateTokens(payload: JwtPayload): ITokens;
  saveToken(token: Token): Promise<boolean>;
  removeToken(token: Token): Promise<void>;
  isTokenExisting(token: Token): Promise<boolean>;
}
