import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesEnum } from './const/roles.const';
import { Roles } from './decorator/role.decorator';
import { User } from './decorator/user.decorator';
import { TransacionInterceptor } from '../common/interceptor/transaction.interceptor';
import { QueryRunner } from '../common/decorator/query-runner.decorator';
import { QueryRunner as QR } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(RolesEnum.ADMIN)
  getUsers() {
    return this.usersService.getAllUsers();
  }

  @Post('follow/:id')
  @UseInterceptors(TransacionInterceptor)
  async postFolow(
    @User('id', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) followeeId: number,
    @QueryRunner() qr?: QR,
  ) {
    await this.usersService.followUser(userId, followeeId, qr);
    return true;
  }

  @Get('follow/me')
  async getFollower(
    @User('id', ParseIntPipe) userId: number,
    @Query('includeNotConfirmed', new DefaultValuePipe(false), ParseBoolPipe)
    includeNotConfirmed: boolean,
  ) {
    return this.usersService.getFollowers(userId, includeNotConfirmed);
  }

  @Patch('follow/:id/confirm')
  @UseInterceptors(TransacionInterceptor)
  async patchFollowConfirm(
    @User('id', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) followerId: number,
    @QueryRunner() qr?: QR,
  ) {
    await this.usersService.confirmFollow(followerId, userId, qr);
    await this.usersService.incrementFollowerCount(userId, qr);
    return true;
  }

  @Delete('follow/:id')
  @UseInterceptors(TransacionInterceptor)
  async deleteFollow(
    @User('id', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) followeeId: number,
    @QueryRunner() qr?: QR,
  ) {
    await this.usersService.deleteFollow(userId, followeeId, qr);
    await this.usersService.decrementFollowerCount(userId, qr);
    return true;
  }

  // @Post()
  // postUser(
  //   @Body('nickname') nickname: string,
  //   @Body('email') email: string,
  //   @Body('password') password: string,
  // ) {
  //   return this.usersService.createUser({
  //     nickname,
  //     email,
  //     password,
  //   });
  // }
}
