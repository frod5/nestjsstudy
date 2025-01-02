import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

interface Post {
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('post')
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
