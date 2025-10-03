import { Token } from '../../token/token.entity';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserRegistrationDto } from '../dto/user-registration.dto';

export interface IUserService {
  create(dto: UserRegistrationDto): Promise<boolean>;
  login(dto: UserLoginDto): Promise<Token | null>;

  logout(refreshToken: string): Promise<boolean>;

  refresh(refreshToken: string): Promise<string | null>;

  activate(activationLink: string): Promise<string | null>;
}
