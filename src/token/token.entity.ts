import { verify } from 'jsonwebtoken';

export class Token {
  private _userId?: number;
  private _refreshToken: string;

  constructor(refreshToken: string, userId?: number) {
    this._refreshToken = refreshToken;
    if (userId) this._userId = userId;
  }

  get refreshToken(): string {
    return this._refreshToken;
  }

  get userId() {
    return this._userId;
  }

  public async validateRefreshToken(secret: string): Promise<boolean> {
    try {
      verify(this._refreshToken, secret);

      return true;
    } catch (e) {
      return false;
    }
  }

  //extend if it needs
}
