import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesEnum } from './const/roles.const';
import { Roles } from './decorator/role.decorator';
import { User } from './decorator/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(RolesEnum.ADMIN)
  getUsers() {
    return this.usersService.getAllUsers();
  }

  @Post('follow/:id')
  async postFolow(
    @User('id', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) followeeId: number,
  ) {
    await this.usersService.followUser(userId, followeeId);
    return true;
  }

  @Get('follow/me')
  async getFollower(@User('id', ParseIntPipe) userId: number) {
    return this.usersService.getFollowers(userId);
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
