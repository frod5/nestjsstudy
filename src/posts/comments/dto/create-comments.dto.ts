import { CommentModel } from '../entities/comment.entity';
import { PickType } from '@nestjs/mapped-types';

export class CreateCommentsDto extends PickType(CommentModel, ['comment']) {}
