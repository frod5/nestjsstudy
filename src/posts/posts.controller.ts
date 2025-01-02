import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';

/**
 * 모듈 생성 nest-cli
 * nest g resource
 */

interface Post {
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPost(): Post {
    return {
      author: 'autor1',
      title: '제목',
      content: '내용',
      likeCount: 100,
      commentCount: 9999,
    };
  }
}
