import { UserModel } from '@prisma/client';
import { User } from '../user.entity';

export interface IUserRepository {
  create(user: User): Promise<UserModel>;
  update(user: User): Promise<UserModel>;

  findByEmail(email: string): Promise<UserModel | null>;
  findById(id: number): Promise<UserModel | null>;
  findByActivationLink(activationLink: string): Promise<UserModel | null>;
}
