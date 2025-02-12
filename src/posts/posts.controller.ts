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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {PostsService} from './posts.service';
import {User} from '../users/decorator/user.decorator';
import {CreatePostDto} from './dto/create-post.dto';
import {UpdatePostDto} from './dto/update-post.dto';
import {PaginatePostDto} from './dto/paginate-post.dto';
import {ImageType} from '../common/entities/image.entity';
import {QueryRunner as QR} from 'typeorm';
import {PostImagesService} from './image/image.service';
import {LogInterceptor} from '../common/interceptor/log.interceptor';
import {TransacionInterceptor} from '../common/interceptor/transaction.interceptor';
import {QueryRunner} from '../common/decorator/query-runner.decorator';
import {RolesEnum} from "../users/const/roles.const";
import {Roles} from "../users/decorator/role.decorator";
import {IsPublic} from "../common/decorator/is-public.decorator";
import {IsPostMineOrAdminGuard} from "./guard/is-post-mine-or-admin.guard";

/**
 * 모듈 생성 nest-cli
 * nest g resource
 */

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postImagesService: PostImagesService,
  ) {}

  //1) Get 모든 posts 조회
  @Get()
  @UseInterceptors(LogInterceptor)
  @IsPublic()
  // @UseFilters(HttpExceptionFilter)
  getPosts(@Query() query: PaginatePostDto) {
    return this.postsService.paginatePosts(query);
  }

  //2) Get/:id 단 건 조회
  @Get(':id')
  @IsPublic()
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  //3) Post
  @Post()
  @UseInterceptors(TransacionInterceptor)
  async postPost(
    @User('id') userId: number,
    @QueryRunner() qr: QR,
    @Body() createPostDto: CreatePostDto,
  ) {
    //로직 실행
    const post = await this.postsService.createPost(userId, createPostDto, qr);
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
    return this.postsService.getPostById(post.id, qr);
  }

  //temp
  @Post('random')
  async postPostsRandom(@User('id') userId: number) {
    await this.postsService.generatePosts(userId);
    return true;
  }

  //4) Put
  @Patch(':postId')
  @UseGuards(IsPostMineOrAdminGuard)
  patchPost(
    @Param('postId', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @Body('isPublic', new DefaultValuePipe(true)) isPublic?: boolean, // new 로 인스턴스화 하면 계속 객체생성됨.
  ) {
    return this.postsService.updatePost(id, updatePostDto);
  }

  //5) delete
  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}
