import { BaseModel } from '../../../common/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsNumber, IsString } from 'class-validator';
import { UsersModel } from '../../../users/entities/users.entity';
import { PostModel } from '../../entities/posts.entity';

@Entity()
export class CommentModel extends BaseModel {
  @Column()
  @IsString()
  comment: string;

  @ManyToOne(() => UsersModel, (user) => user.comments)
  author: UsersModel;

  @ManyToOne(() => PostModel, (post) => post.id)
  post: PostModel;

  @Column({
    default: 0,
  })
  @IsNumber()
  likeCount: number;
}
