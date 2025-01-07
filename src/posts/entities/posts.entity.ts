import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersModel } from '../../users/entities/users.entity';
import { BaseModel } from '../../study/entities/inheritance.entity';

@Entity()
export class PostModel extends BaseModel {
  @ManyToOne(() => UsersModel, (user) => user.posts, {
    nullable: false,
  })
  author: UsersModel;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}
