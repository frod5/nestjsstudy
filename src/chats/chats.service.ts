import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChatsModel } from './entities/chats.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { PaginateChatDto } from './dto/paginate-chat.dto';
import { CommonService } from '../common/common.service';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatsModel)
    private readonly chatRepository: Repository<ChatsModel>,
    private readonly commonService: CommonService,
  ) {}

  paginateChats(dto: PaginateChatDto) {
    return this.commonService.pagenate(
      dto,
      this.chatRepository,
      { relations: ['users'] },
      'chats',
    );
  }

  async createChat(dto: CreateChatDto) {
    const chat = await this.chatRepository.save({
      users: dto.userIds.map((id) => ({ id })),
    });

    return await this.chatRepository.findOne({
      where: { id: chat.id },
    });
  }

  async checkIfChatExists(chatId: number) {
    return await this.chatRepository.exists({
      where: { id: chatId },
    });
  }
}
