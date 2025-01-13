import { FindManyOptions } from 'typeorm';
import { CommentModel } from '../entities/comment.entity';

export const DEFAULT_COMMENTS_FIND_OPTIONS: FindManyOptions<CommentModel> = {
  relations: {
    author: true,
    post: true,
  },
  select: {
    author: {
      id: true,
      nickname: true,
      email: true,
    },
    post: {
      title: true,
      content: true,
      images: true,
    },
  },
};
