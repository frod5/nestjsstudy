import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { ChatsGateway } from './chats.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from '../users/entities/users.entity';
import { ChatsModel } from './entities/chats.entity';
import { CommonModule } from '../common/common.module';
import { ChatMessagesService } from './messages/messages.service';
import { MessagesModel } from './messages/entities/messages.entity';
import { MessaagesController } from './messages/messaages.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersModel, ChatsModel, MessagesModel]),
    CommonModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [ChatsController, MessaagesController],
  providers: [ChatsGateway, ChatsService, ChatMessagesService],
})
export class ChatsModule {}
