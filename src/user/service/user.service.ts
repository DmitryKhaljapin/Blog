import { inject, injectable } from 'inversify';
import { IUserService } from './user.service.intarface';
import { TYPES } from '../../types';
import { IConfigService } from '../../config/config.service.interface';
import { IUserRepository } from '../repository/user.repository.interface';
import { IMailService } from '../../mail/mail.service.interface';
import { ITokenService } from '../../token/service/token.service.interface';
import { Token } from '../../token/token.entity';
import { UserRegistrationDto } from '../dto/user-registration.dto';
import { User } from '../user.entity';
import { v4 } from 'uuid';
import { UserLoginDto } from '../dto/user-login.dto';
import { ITokens } from '../../common/tokens.interface';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.MailService) private mailService: IMailService,
    @inject(TYPES.TokenService) private tokenService: ITokenService,
  ) {}

  public async create({
    email,
    name,
    password,
  }: UserRegistrationDto): Promise<boolean> {
    const candidate = await this.userRepository.findByEmail(email);

    if (candidate) return false;

    const newUser = new User(name, email);

    const salt = Number(this.configService.get('SALT'));
    await newUser.setPassword(password, salt);

    const activationLinkHash = v4();
    const activationLink = `${this.configService.get('API_URL')}/api/activate/${activationLinkHash}`;
    newUser.activationLink = activationLinkHash;

    await this.mailService.sendActivationLink(newUser.email, activationLink);

    await this.userRepository.create(newUser);

    return true;
  }

  public async login({
    email,
    password,
  }: UserLoginDto): Promise<ITokens | null> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (!existingUser) return null;

    const user = new User(
      existingUser.email,
      existingUser.name,
      existingUser.password,
    );

    const isValidUser = await user.comparePassword(password);

    if (!isValidUser) return null;

    const tokens = this.tokenService.generateTokens({ email: user.email });

    const refreshToken = new Token(tokens.refreshToken, existingUser.id);
    const result = await this.tokenService.saveToken(refreshToken);

    if (!result) return null;

    return tokens;
  }

  public async logout(refreshToken: string): Promise<void> {
    if (!refreshToken) return;

    const token = new Token(refreshToken);

    await this.tokenService.removeToken(token);
  }

  public async refresh(refreshToken: string): Promise<string | null> {
    if (!refreshToken) return null;

    const tokenData = await this.tokenService.findToken(refreshToken);

    if (!tokenData) return null;

    const token = new Token(tokenData.refreshToken, tokenData.userId);

    const isValidToken = await token.validateRefreshToken(
      this.configService.get('JWT_REFRESH_SECRET'),
    );

    if (!isValidToken) return null;
    console.log(2);
    const userData = await this.userRepository.findById(tokenData.userId);

    if (!userData) return null;
    console.log(3);
    const accessToken = this.tokenService.generateAccessToken({
      email: userData.email,
    });

    return accessToken;
  }

  public async activate(activationLink: string): Promise<ITokens | null> {
    const userData =
      await this.userRepository.findByActivationLink(activationLink);

    if (!userData) return null;

    const user = new User(userData.name, userData.email, userData.password);
    user.activationLink = activationLink;
    user.isActivated = true;

    await this.userRepository.update(user);

    const tokens = this.tokenService.generateTokens({ email: user.email });

    const refreshToken = new Token(tokens.refreshToken, userData.id);

    await this.tokenService.saveToken(refreshToken);

    return tokens;
  }
}
