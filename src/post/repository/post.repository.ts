import { inject, injectable } from 'inversify';
import { IPost, IPostRepository } from './post.repository.interface';
import { TYPES } from '../../types';
import { PrismaService } from '../../database/prisma.service';
import { PostModel } from '@prisma/client';
import { Post } from '../post.entity';

@injectable()
export class PostRepository implements IPostRepository {
  constructor(
    @inject(TYPES.PrismaService) private prismaService: PrismaService,
  ) {}

  public async create(post: Post): Promise<PostModel> {
    return await this.prismaService.client.postModel.create({
      data: {
        title: post.title,
        content: post.content,
        createdAt: post.createAt,
        userId: post.userId,
      },
    });
  }

  public async getById(id: number): Promise<IPost | null> {
    return await this.prismaService.client.postModel.findFirst({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  public async getAll(): Promise<IPost[]> {
    return await this.prismaService.client.postModel.findMany({
      include: { user: { select: { name: true } } },
    });
  }
}
