import { IsNumber } from 'class-validator';

export class PostGetDto {
  @IsNumber({}, { message: 'post ID is missing' })
  id: number;
}
