export class Post {
  id?: number;
  createAt: Date;

  constructor(
    public title: string,
    public content: string,
    public userId: number,
    id?: number,
    createdAt?: Date,
  ) {
    if (id) this.id = id;

    if (createdAt) {
      this.createAt = createdAt;
    } else {
      this.createAt = new Date();
    }
  }
}
