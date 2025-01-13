import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { StudyService } from './study.service';
import {IsPublic} from "../common/decorator/is-public.decorator";

@Controller('study')
export class StudyController {
  constructor(private readonly usersService: StudyService) {}

  @Get()
  @IsPublic()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @IsPublic()
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post()
  @IsPublic()
  create(@Body('title') title: string) {
    return this.usersService.create(title);
  }

  @Patch(':id')
  @IsPublic()
  update(@Param('id') id: string, @Body('title') title: string) {
    return this.usersService.patch(+id, title);
  }

  @Delete(':id')
  @IsPublic()
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('profile')
  @IsPublic()
  createUserAndProfile() {
    return this.usersService.createUserAndProfile();
  }

  @Post('/user/car')
  @IsPublic()
  createUserAndCar() {
    return this.usersService.createUserAndCar();
  }

  @Post('/tags/cars')
  @IsPublic()
  createTagAndCar() {
    return this.usersService.createTagAndCar();
  }

  @Get('/user/cars')
  @IsPublic()
  getCars() {
    // return 'test';
    return this.usersService.getAllCars();
  }

  @Get('/user/tags')
  @IsPublic()
  getTags() {
    return this.usersService.getAllTags();
  }

  @Delete('profile/:id')
  @IsPublic()
  deleteProfile(@Param('id') id: string) {
    return this.usersService.deleteProfile(+id);
  }

  @Post('sample')
  @IsPublic()
  sample() {
    return this.usersService.sample();
  }
}
