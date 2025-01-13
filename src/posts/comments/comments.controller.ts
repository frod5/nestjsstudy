import {
  Body,
  Controller,
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
import { CommentsService } from './comments.service';
import { PaginateCommentsDto } from './dto/paginate-comments.dto';
import { AccessTokenGuard } from '../../auth/guard/baerer-token.guard';
import { CreateCommentsDto } from './dto/create-comments.dto';
import { User } from '../../users/decorator/user.decorator';
import { TransacionInterceptor } from '../../common/interceptor/transaction.interceptor';
import { QueryRunner } from '../../common/decorator/query-runner.decorator';
import { UpdateCommentsDto } from './dto/update-comments.dto';
import { QueryRunner as QR } from 'typeorm';
import { IsPublic } from '../../common/decorator/is-public.decorator';
import { IsCommentMineOrAdminGuard } from './guard/is-comment-mine-or-admin.guard';
import { PostsService } from '../posts.service';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly postsService: PostsService,
  ) {}

  @Get()
  @IsPublic()
  pagenatedComments(
    @Query() dto: PaginateCommentsDto,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.commentsService.getPagingCommentsByPostId(dto, postId);
  }

  @Get(':commentId')
  @IsPublic()
  getComment(@Param('commentId', ParseIntPipe) commentId: number) {
    return this.commentsService.getCommentById(commentId);
  }

  @Post()
  @UseInterceptors(TransacionInterceptor)
  async createComment(
    @Body() dto: CreateCommentsDto,
    @User('id') userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @QueryRunner() qr?: QR,
  ) {
    const res = await this.commentsService.createComment(
      dto,
      userId,
      postId,
      qr,
    );
    await this.postsService.incrementCommentCount(postId, qr);
    return res;
  }

  @Patch(':commentId')
  @UseInterceptors(TransacionInterceptor)
  @UseGuards(IsCommentMineOrAdminGuard)
  async patchComment(
    @Body() dto: UpdateCommentsDto,
    @User('id') userId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @QueryRunner() qr?: QR,
  ) {
    return this.commentsService.updateComment(
      dto,
      userId,
      postId,
      commentId,
      qr,
    );
  }

  @Delete(':commentId')
  @UseGuards(IsCommentMineOrAdminGuard)
  @UseInterceptors(TransacionInterceptor)
  async deleteComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @QueryRunner() qr?: QR,
  ) {
    const res = await this.commentsService.deleteComment(commentId);
    await this.postsService.decrementCommentCount(postId, qr);
    return res;
  }
}
