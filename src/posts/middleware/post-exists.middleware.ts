import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  NotFoundException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PostsService } from '../posts.service';

@Injectable()
export class PostExistsMiddleware implements NestMiddleware {
  constructor(private readonly postsService: PostsService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const postId = parseInt(req.params.postId);
    const exists = await this.postsService.checkExistsPosts(postId);

    if (!postId) {
      throw new BadRequestException('Post Id는 필수 입니다.');
    }

    if (!exists) {
      throw new NotFoundException('Post not exists');
    }

    next();
  }
}
