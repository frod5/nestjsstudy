import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request, UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import {AccessTokenGuard} from "../auth/guard/baerer-token";
import {UsersModel} from "../users/entities/users.entity";
import {User} from "../users/decorator/user.decorator";

/**
 * 모듈 생성 nest-cli
 * nest g resource
 */

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  //1) Get 모든 posts 조회
  @Get()
  getPosts() {
    return this.postsService.getAllPosts();
  }

  //2) Get/:id 단 건 조회
  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  //3) Post
  @Post()
  @UseGuards(AccessTokenGuard)
  postPost(
    @User('id') userId: number,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    return this.postsService.createPost(userId, title, content);
  }

  //4) Put
  @Put(':id')
  putPost(
    @Param('id', ParseIntPipe) id: number,
    @Body('title') title?: string,
    @Body('content') content?: string,
    @Body('isPublic', new DefaultValuePipe(true)) isPublic?: boolean, // new 로 인스턴스화 하면 계속 객체생성됨.
  ) {
    return this.postsService.updatePost(id, title, content);
  }

  //5) delete
  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}
