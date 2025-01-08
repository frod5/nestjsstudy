import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersModel } from '../../users/entities/users.entity';
import { BaseModel } from '../../study/entities/inheritance.entity';
import {IsString} from "class-validator";
import {stringValidationMessage} from "../../common/validation-message/string-validation.message";

@Entity()
export class PostModel extends BaseModel {
  @ManyToOne(() => UsersModel, (user) => user.posts, {
    nullable: false,
  })
  author: UsersModel;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  title: string;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}
