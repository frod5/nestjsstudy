import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateChatDto } from './dto/create-chat.dto';
import * as console from 'node:console';
import { ChatsService } from './chats.service';
import { EnterChatDto } from './dto/enter-chat.dto';
import { CreateMessagesDto } from './messages/dto/create-messages.dto';
import { ChatMessagesService } from './messages/messages.service';
import {
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SocketCatchHttpExceptionFilter } from '../common/filter/socket-catch-http.exception-filter';
import { SocketBaererTokenGuard } from '../auth/guard/socket/socket-baerer-token.guard';
import { UsersModel } from '../users/entities/users.entity';

@WebSocketGateway({
  // ws://localhost:3000/chats
  namespace: 'chats',
})
export class ChatsGateway implements OnGatewayConnection {
  constructor(
    private readonly chatService: ChatsService,
    private readonly messagesService: ChatMessagesService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket) {
    console.log(`on connect called: ${socket.id}`);
  }

  //main.ts에 글로벌 pipe는 지금은 http 컨트롤러에만 적용된다.
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // class-transformer가 타입변환까지 해준다.
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @UseFilters(SocketCatchHttpExceptionFilter)
  @UseGuards(SocketBaererTokenGuard)
  @SubscribeMessage('create_chat')
  async createChat(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() socket: Socket & { user: UsersModel },
  ) {
    const chat = await this.chatService.createChat(data);
  }

  // 클래식은
  // socket.on('send_message', (message) => {console.log(message)});
  @SubscribeMessage('send_message')
  async sendMessage(
    @MessageBody() dto: CreateMessagesDto,
    @ConnectedSocket() socket: Socket,
  ) {
    if (!(await this.chatService.checkIfChatExists(dto.chatId))) {
      throw new WsException({
        code: 100,
        message: `존재하지 않는 chat Id 입니다. chatId: ${dto.chatId} `,
      });
    }

    const message = await this.messagesService.createMessage(dto);
    //broadcast
    socket
      .to(message.chat.id.toString())
      .emit('receive_message', message.message);
    // this.server
    //   .in(message.chatId.toString())
    //   .emit('receive_message', message.message);
  }

  @SubscribeMessage('enter_chat')
  async enterChat(
    //방의 ID를 리스트로받는다.
    @MessageBody() data: EnterChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    for (const chatId of data.chatIds) {
      if (!(await this.chatService.checkIfChatExists(chatId))) {
        throw new WsException({
          code: 100,
          message: `존재하지 않는 chat Id 입니다. chatId: ${chatId} `,
        });
      }
    }

    socket.join(data.chatIds.map((value) => value.toString()));
  }
}
