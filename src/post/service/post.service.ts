import { inject, injectable } from 'inversify';
import { PostCreateDto } from '../dto/post-create.dto';
import { Post } from '../post.entity';
import { IPostService } from './post.service.interface';
import { TYPES } from '../../types';
import { IPostRepository } from '../repository/post.repository.interface';
import e from 'express';

@injectable()
export class PostService implements IPostService {
  constructor(
    @inject(TYPES.PostRepository) private postRepository: IPostRepository,
  ) {}

  public async create({
    title,
    content,
    userId,
  }: PostCreateDto): Promise<void> {
    const newPost = new Post(title, content, userId);

    await this.postRepository.create(newPost);
  }

  public async findById(id: number): Promise<Post | null> {
    const existringPost = await this.postRepository.getById(id);

    if (!existringPost) return null;

    const post = new Post(
      existringPost.title,
      existringPost.content,
      existringPost.userId,
      existringPost.id,
      existringPost.createdAt,
      existringPost.user.name,
    );

    return post;
  }

  public async findAll(): Promise<Post[]> {
    const existringPosts = await this.postRepository.getAll();

    const posts = existringPosts.map(
      (existringPost) =>
        new Post(
          existringPost.title,
          existringPost.content,
          existringPost.userId,
          existringPost.id,
          existringPost.createdAt,
          existringPost.user.name,
        ),
    );

    return posts;
  }
}
