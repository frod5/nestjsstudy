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
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from '../auth/guard/baerer-token';
import { User } from '../users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { ImageType } from '../common/entities/image.entity';
import { DataSource } from 'typeorm';
import { PostImagesService } from './image/image.service';
import {LogIntercepter} from "../common/intercepter/log.intercepter";

/**
 * 모듈 생성 nest-cli
 * nest g resource
 */

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postImagesService: PostImagesService,
    private readonly dataSource: DataSource,
  ) {}

  //1) Get 모든 posts 조회
  @Get()
  @UseInterceptors(LogIntercepter)
  getPosts(@Query() query: PaginatePostDto) {
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
  async postPost(
    @User('id') userId: number,
    @Body() createPostDto: CreatePostDto,
  ) {
    //트랜잭션과 관련되 모든 쿼리를 담당할
    // 쿼리 러너 생성
    const qr = this.dataSource.createQueryRunner();

    //쿼리 러너 연결
    await qr.connect();
    // 쿼리 러너에서 트랜잭션 시작
    // 이 시점부터 같은 쿼리 러너를 사용하면
    // 트랜잭션 안에서 데이터베이스 액션을 실행할 수 있다.
    await qr.startTransaction();

    //로직 실행
    try {
      const post = await this.postsService.createPost(
        userId,
        createPostDto,
        qr,
      );
      for (let i = 0; i < createPostDto.images.length; i++) {
        await this.postImagesService.createPostImage(
          {
            post: post,
            order: i,
            path: createPostDto.images[i],
            type: ImageType.POST_IMAGE,
          },
          qr,
        );
      }

      //커밋
      await qr.commitTransaction();
      await qr.release();
      return this.postsService.getPostById(post.id);
    } catch (e) {
      await qr.rollbackTransaction();
      await qr.release();
    }
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
