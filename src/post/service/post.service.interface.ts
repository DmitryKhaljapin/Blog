import { PostCreateDto } from '../dto/post-create.dto';
import { Post } from '../post.entity';

export interface IPostService {
  create(post: PostCreateDto): Promise<Post>;
  findById(id: number): Promise<Post | null>;
  findAll(): Promise<Post[]>;
}
