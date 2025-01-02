import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserModel } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentModel, TeacherModel } from './entities/person.entity';
import {
  AirplaneModel,
  BookModel,
  CarModel,
  ComputerModel,
  SingleBaseModel,
} from './entities/inheritance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserModel,
      StudentModel,
      TeacherModel,
      BookModel,
      CarModel,
      ComputerModel,
      AirplaneModel,
      SingleBaseModel,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
