import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { MessagesModel } from './entities/messages.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from '../../common/common.service';
import { BasePaginationDto } from '../../common/dto/base-pagination.dto';
import { CreateMessagesDto } from './dto/create-messages.dto';

@Injectable()
export class ChatMessagesService {
  constructor(
    @InjectRepository(MessagesModel)
    private readonly messagesRepository: Repository<MessagesModel>,
    private readonly commonService: CommonService,
  ) {}

  async createMessage(dto: CreateMessagesDto, authorId: number) {
    const message = await this.messagesRepository.save({
      chat: { id: dto.chatId },
      author: { id: authorId },
      message: dto.message,
    });

    return this.messagesRepository.findOne({
      where: { id: message.id },
      relations: { chat: true },
    });
  }

  paginateMessages(
    dto: BasePaginationDto,
    overrideFindManyOptions: FindManyOptions<MessagesModel>,
  ) {
    return this.commonService.pagenate(
      dto,
      this.messagesRepository,
      overrideFindManyOptions,
      'messages',
    );
  }
}
