import { PostModel, UserModel } from '@prisma/client';
import { Post } from '../post.entity';

export type IPost = {
  user: {
    name: string;
  };
} & PostModel;

export interface IPostRepository {
  create(post: Post): Promise<PostModel>;
  getById(id: number): Promise<IPost | null>;
  getAll(): Promise<IPost[]>;
}
