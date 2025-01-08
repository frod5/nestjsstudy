import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from '../auth/guard/baerer-token';
import { User } from '../users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

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
  postPost(@User('id') userId: number, @Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(userId, createPostDto);
  }

  //4) Put
  @Patch(':id')
  patchPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Body('isPublic', new DefaultValuePipe(true)) isPublic?: boolean, // new 로 인스턴스화 하면 계속 객체생성됨.
  ) {
    return this.postsService.updatePost(id, updatePostDto);
  }

  //5) delete
  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}
