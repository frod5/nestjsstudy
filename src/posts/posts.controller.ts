import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';

/**
 * 모듈 생성 nest-cli
 * nest g resource
 */

interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

let posts: PostModel[] = [
  {
    id: 1,
    author: 'kim',
    title: 'title1',
    content: 'content1',
    likeCount: 999,
    commentCount: 100,
  },
  {
    id: 2,
    author: 'lee',
    title: 'title2',
    content: 'content2',
    likeCount: 199,
    commentCount: 120,
  },
  {
    id: 3,
    author: 'park',
    title: 'title3',
    content: 'content3',
    likeCount: 99,
    commentCount: 10,
  },
];

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  //1) Get 모든 posts 조회
  @Get()
  getPosts(): PostModel[] {
    return posts;
  }

  //2) Get/:id 단 건 조회
  @Get(':id')
  getPost(@Param('id') id: string): PostModel {
    const post = posts.find((post) => post.id === +id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  //3) Post
  @Post()
  postPost(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ): PostModel {
    const post: PostModel = {
      id: posts[posts.length - 1].id + 1,
      author: author,
      title: title,
      content: content,
      likeCount: 0,
      commentCount: 0,
    };
    posts = [...posts, post];
    return post;
  }

  //4) Put
  @Put(':id')
  putPost(
    @Param('id') id: string,
    @Body('author') author?: string,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ) {
    const post = posts.find((post) => post.id === +id);
    if (!post) {
      throw new NotFoundException();
    }

    if (author) post.author = author;
    if (title) post.title = title;
    if (content) post.content = content;
    posts = posts.map((prev) => (prev.id === +id ? post : prev));
    return post;
  }
}
