import { BaseModel } from '../../../study/entities/inheritance.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ChatsModel } from '../../entities/chats.entity';
import { UsersModel } from '../../../users/entities/users.entity';
import { IsString } from 'class-validator';

@Entity()
export class MessagesModel extends BaseModel {
  @ManyToOne((type) => ChatsModel, (chat) => chat.messages)
  chat: ChatsModel;

  @ManyToOne(() => UsersModel, (user) => user.messages)
  author: UsersModel;

  @Column()
  @IsString()
  message: string;
}
