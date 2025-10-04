import { TokenModel } from '@prisma/client';
import { Token } from '../token.entity';

export interface ITokenRepository {
  create(token: Token): Promise<boolean>;
  update(token: Token): Promise<boolean>;

  findByRefreshToken(refreshToken: string): Promise<TokenModel | null>;
  findByUserId(userId: number): Promise<TokenModel | null>;

  remove(token: Token): Promise<void>;
}
