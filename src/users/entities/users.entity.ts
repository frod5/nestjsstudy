import {Column, Entity, JoinTable, ManyToMany, OneToMany} from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { PostModel } from '../../posts/entities/posts.entity';
import { BaseModel } from '../../study/entities/inheritance.entity';
import { IsEmail, IsString, Length } from 'class-validator';
import { lengthValidationMessage } from '../../common/validation-message/length-validation.message';
import { stringValidationMessage } from '../../common/validation-message/string-validation.message';
import { emailValidationMessage } from '../../common/validation-message/email-validation.message';
import { Exclude } from 'class-transformer';
import { ChatsModel } from '../../chats/entities/chats.entity';
import {MessagesModel} from "../../chats/messages/entities/messages.entity";

@Entity()
// @Exclude()
export class UsersModel extends BaseModel {
  @Column({
    length: 20,
    unique: true,
  })
  @IsString({
    message: stringValidationMessage,
  })
  @Length(1, 20, {
    message: lengthValidationMessage,
  })
  // @Expose()
  nickname: string;

  @Column({
    unique: true,
  })
  @IsString({
    message: stringValidationMessage,
  })
  @IsEmail(
    {},
    {
      message: emailValidationMessage,
    },
  )
  email: string;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  @Length(3, 8, {
    message: lengthValidationMessage,
  })
  @Exclude({
    toPlainOnly: true,
  })
  password: string;

  // property에서의 Expose()
  // 1) class에 Exclude() 선언 후 property에 적용하면 적용한 property만 노출.
  // 2) class에 Exclude() 없이, 적용하면, 실제로 없는 property 노출 가능.
  // @Expose()
  // get nicknameAndEmail() {
  //   return this.nickname + '/' + this.email;
  // }

  @Column({
    type: 'enum',
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @OneToMany(() => PostModel, (post) => post.author)
  posts: PostModel[];

  @ManyToMany(() => ChatsModel, (chat) => chat.users)
  @JoinTable()
  chats: ChatsModel[];

  @OneToMany(() => MessagesModel, (message) => message.author)
  messages: MessagesModel[];
}
