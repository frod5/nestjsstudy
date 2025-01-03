import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { StudyService } from './study.service';

@Controller('study')
export class StudyController {
  constructor(private readonly usersService: StudyService) {}

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

  @Post('/user/car')
  createUserAndCar() {
    return this.usersService.createUserAndCar();
  }

  @Post('/tags/cars')
  createTagAndCar() {
    return this.usersService.createTagAndCar();
  }

  @Get('/user/cars')
  getCars() {
    // return 'test';
    return this.usersService.getAllCars();
  }

  @Get('/user/tags')
  getTags() {
    return this.usersService.getAllTags();
  }

  @Delete('profile/:id')
  deleteProfile(@Param('id') id: string) {
    return this.usersService.deleteProfile(+id);
  }

  @Post('sample')
  sample() {
    return this.usersService.sample();
  }
}
