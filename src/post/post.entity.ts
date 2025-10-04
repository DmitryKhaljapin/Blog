export class Post {
  id?: number;
  readonly createAt: Date;
  author: string;

  constructor(
    public title: string,
    public content: string,
    public userId: number,
    id?: number,
    createdAt?: Date,
    author?: string,
  ) {
    if (id) this.id = id;

    if (createdAt) {
      this.createAt = createdAt;
    } else {
      this.createAt = new Date();
    }

    if (author) this.author = author;
  }
}
