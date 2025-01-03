import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post()
  create(@Body('title') title: string) {
    return this.usersService.create(title);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body('title') title: string) {
    return this.usersService.patch(+id, title);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('profile')
  createUserAndProfile() {
    return this.usersService.createUserAndProfile();
  }
}
