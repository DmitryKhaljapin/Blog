import { compare, hash } from 'bcryptjs';

export class User {
  private _name: string;
  private _email: string;
  private _password: string;
  private _acticationLink: string;
  private _isActivated: boolean;

  constructor(name: string, email: string, passwordHash?: string) {
    this._name = name;
    this._email = email;
    if (passwordHash) this._password = passwordHash;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get email(): string {
    return this._email;
  }

  set email(email: string) {
    this._email = email;
  }

  get password(): string {
    return this._password;
  }

  get activationLink(): string {
    return this._acticationLink;
  }

  set activationLink(activationLink: string) {
    this._acticationLink = activationLink;
  }

  get isActivated(): boolean {
    return this._isActivated;
  }

  set isActivated(isActivated: boolean) {
    this._isActivated = isActivated;
  }

  public async setPassword(password: string, salt: number): Promise<void> {
    this._password = await hash(password, salt);
  }

  public async comparePassword(password: string): Promise<boolean> {
    return compare(password, this._password);
  }
}
