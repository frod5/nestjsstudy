import { Injectable, NotFoundException } from '@nestjs/common';
import { CommonService } from '../../common/common.service';
import { PaginateCommentsDto } from './dto/paginate-comments.dto';
import { QueryRunner, Repository } from 'typeorm';
import { CommentModel } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommentsDto } from './dto/create-comments.dto';
import { UpdateCommentsDto } from './dto/update-comments.dto';
import { DEFAULT_COMMENTS_FIND_OPTIONS } from './const/default-comments-find-option.const';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commonService: CommonService,
    @InjectRepository(CommentModel)
    private readonly commentsRepository: Repository<CommentModel>,
  ) {}

  getPagingCommentsByPostId(dto: PaginateCommentsDto, postId: number) {
    return this.commonService.pagenate(
      dto,
      this.commentsRepository,
      {
        ...DEFAULT_COMMENTS_FIND_OPTIONS,
        where: {
          post: {
            id: postId,
          },
        },
      },
      `posts/${postId}/comments`,
    );
  }

  async getCommentById(commentId: number) {
    const comment = await this.commentsRepository.findOne({
      ...DEFAULT_COMMENTS_FIND_OPTIONS,
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      throw new NotFoundException(
        `commentId: ${commentId} / Comment not found`,
      );
    }

    return comment;
  }

  async createComment(
    dto: CreateCommentsDto,
    userId: number,
    postId: number,
    qr?: QueryRunner,
  ) {
    return this.getRepository(qr).save({
      ...dto,
      author: {
        id: userId,
      },
      post: {
        id: postId,
      },
    });
  }

  getRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository(CommentModel)
      : this.commentsRepository;
  }

  async updateComment(
    dto: UpdateCommentsDto,
    userId: number,
    postId: number,
    commentId: number,
    qr: QueryRunner,
  ) {
    const preItem = await this.getRepository(qr).preload({
      id: commentId,
    });

    return this.getRepository(qr).save({
      ...preItem,
      ...dto,
    });
  }

  async deleteComment(commentId: number) {
    return this.commentsRepository.delete(commentId);
  }
}
