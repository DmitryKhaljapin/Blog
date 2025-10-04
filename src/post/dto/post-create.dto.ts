import { IsString } from 'class-validator';

export class PostCreateDto {
  @IsString({ message: 'title is missing' })
  title: string;

  @IsString({ message: 'content is missing' })
  content: string;
}
