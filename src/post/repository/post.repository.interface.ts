import { PostModel } from '@prisma/client';
import { Post } from '../post.entity';

export interface IPostRepository {
  create(post: Post): Promise<PostModel>;
  getById(id: number): Promise<PostModel | null>;
  getAll(): Promise<PostModel[]>;
}
