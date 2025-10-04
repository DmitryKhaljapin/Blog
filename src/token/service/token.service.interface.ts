import { JwtPayload } from 'jsonwebtoken';
import { Token } from '../token.entity';
import { TokenModel } from '@prisma/client';
import { ITokens } from '../../common/tokens.interface';

export interface ITokenService {
  generateTokens(payload: JwtPayload): ITokens;
  generateAccessToken(payload: JwtPayload): string;
  saveToken(token: Token): Promise<boolean>;
  removeToken(token: Token): Promise<void>;
  isTokenExisting(token: Token): Promise<boolean>;
  findToken(refreshToken: string): Promise<TokenModel | null>;
}
