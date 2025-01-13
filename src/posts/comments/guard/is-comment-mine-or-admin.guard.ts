import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CommentsService } from '../comments.service';
import { Request } from 'express';
import { UsersModel } from '../../../users/entities/users.entity';
import { RolesEnum } from '../../../users/const/roles.const';

@Injectable()
export class IsCommentMineOrAdminGuard implements CanActivate {
  constructor(private readonly commentsService: CommentsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request & {
      user: UsersModel;
    };

    const { user } = req;
    const commentId = parseInt(req.params.commentId);

    if (!user) {
      throw new UnauthorizedException('사용자 정보를 찾을 수 없습니다.');
    }

    if (user.role === RolesEnum.ADMIN) {
      return true;
    }

    const isOk = await this.commentsService.isCommentMine(user.id, commentId);

    if (!isOk) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    return true;
  }
}
