import { ITokens } from '../../common/tokens.interface';
import { Token } from '../../token/token.entity';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserRegistrationDto } from '../dto/user-registration.dto';

export interface IUserService {
  create(dto: UserRegistrationDto): Promise<boolean>;
  login(dto: UserLoginDto): Promise<ITokens | null>;

  logout(refreshToken: string): Promise<void>;

  refresh(refreshToken: string): Promise<string | null>;

  activate(activationLink: string): Promise<ITokens | null>;
}
