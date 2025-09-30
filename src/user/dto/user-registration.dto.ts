import { IsEmail, IsString } from 'class-validator';

export class UserRegistration {
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  @IsString({ message: 'Name is missing' })
  name: string;

  @IsString({ message: 'Password is missing' })
  password: string;
}
