import { inject, injectable } from 'inversify';
import { IUserRepository } from './user.repository.interface';
import { TYPES } from '../../types';
import { UserModel } from '@prisma/client';
import { User } from '../user.entity';
import { PrismaService } from '../../database/prisma.service';

@injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @inject(TYPES.PrismaService) private prismaService: PrismaService,
  ) {}

  public async create(user: User): Promise<UserModel> {
    return await this.prismaService.client.userModel.create({
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
        activationLink: user.activationLink,
      },
    });
  }

  public async update(user: User): Promise<UserModel> {
    return await this.prismaService.client.userModel.update({
      where: {
        email: user.email,
      },
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
        activationLink: user.activationLink,
      },
    });
  }

  public async findByEmail(email: string): Promise<UserModel | null> {
    return await this.prismaService.client.userModel.findFirst({
      where: {
        email,
      },
    });
  }

  public async findById(id: number): Promise<UserModel | null> {
    return await this.prismaService.client.userModel.findFirst({
      where: {
        id,
      },
    });
  }

  public async findByActivationLink(
    activationLink: string,
  ): Promise<UserModel | null> {
    return await this.prismaService.client.userModel.findFirst({
      where: {
        activationLink,
      },
    });
  }
}
