import { inject, injectable } from 'inversify';
import { TYPES } from '../../types';
import { ITokenRepository } from './token.repository.interface';
import { Token } from '../token.entity';
import { PrismaService } from '../../database/prisma.service';
import { TokenModel } from '@prisma/client';

@injectable()
export class TokenRepository implements ITokenRepository {
  constructor(
    @inject(TYPES.PrismaService) private prismaService: PrismaService,
  ) {}

  public async create({ userId, refreshToken }: Token): Promise<boolean> {
    if (!userId) return false;

    await this.prismaService.client.tokenModel.create({
      data: {
        userId,
        refreshToken,
      },
    });

    return true;
  }

  public async update({ refreshToken, userId }: Token): Promise<boolean> {
    if (!userId) return false;

    await this.prismaService.client.tokenModel.update({
      where: {
        userId,
      },
      data: {
        refreshToken,
      },
    });

    return true;
  }

  public async findByRefreshToken(
    refreshToken: string,
  ): Promise<TokenModel | null> {
    return await this.prismaService.client.tokenModel.findFirst({
      where: {
        refreshToken,
      },
    });
  }

  public async remove(token: Token): Promise<void> {
    await this.prismaService.client.tokenModel.deleteMany({
      where: {
        refreshToken: token.refreshToken,
      },
    });
  }
}
