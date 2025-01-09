import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ChatMessagesService } from './messages.service';
import { BasePaginationDto } from '../../common/dto/base-pagination.dto';

@Controller('chats/:cid/messages')
export class MessaagesController {
  constructor(private readonly messagesService: ChatMessagesService) {}

  @Get()
  async paginateMessages(
    @Param('cid', ParseIntPipe) cid: number,
    @Query() dto: BasePaginationDto,
  ) {
    return await this.messagesService.paginateMessages(dto, {
      where: {
        chat: {
          id: cid,
        },
      },
      relations: {
        author: true,
        chat: true,
      },
    });
  }
}
