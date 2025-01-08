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
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {PostsService} from './posts.service';
import {AccessTokenGuard} from '../auth/guard/baerer-token';
import {User} from '../users/decorator/user.decorator';
import {CreatePostDto} from './dto/create-post.dto';
import {UpdatePostDto} from './dto/update-post.dto';
import {PaginatePostDto} from './dto/paginate-post.dto';
import {FileInterceptor} from "@nestjs/platform-express";

/**
 * 모듈 생성 nest-cli
 * nest g resource
 */

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  //1) Get 모든 posts 조회
  @Get()
  getPosts(@Query() query: PaginatePostDto) {
    // return this.postsService.getAllPosts();
    return this.postsService.paginatePosts(query);
  }

  //2) Get/:id 단 건 조회
  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  //3) Post
  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  postPost(
    @User('id') userId: number,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.postsService.createPost(userId, createPostDto, file?.filename);
  }

  //temp
  @Post('random')
  @UseGuards(AccessTokenGuard)
  async postPostsRandom(@User('id') userId: number) {
    await this.postsService.generatePosts(userId);
    return true;
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
