export class Post {
  id?: number;
  createAt: Date;

  constructor(
    public title: string,
    public content: string,
    public userId: number,
  ) {
    this.createAt = new Date();
  }
}
