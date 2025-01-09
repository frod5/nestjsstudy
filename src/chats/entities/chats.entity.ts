import { BaseModel } from '../../study/entities/inheritance.entity';
import {Entity, ManyToMany, OneToMany} from 'typeorm';
import { UsersModel } from '../../users/entities/users.entity';
import {MessagesModel} from "../messages/entities/messages.entity";

@Entity()
export class ChatsModel extends BaseModel {
  @ManyToMany(() => UsersModel, (user) => user.chats)
  users: UsersModel[];

  @OneToMany(type => ChatsModel, (chat) => chat.messages)
  messages: MessagesModel[];
}
