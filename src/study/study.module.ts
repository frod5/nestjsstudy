import { Module } from '@nestjs/common';
import { StudyService } from './study.service';
import { StudyController } from './study.controller';
import { UserStudyModel } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentModel, TeacherModel } from './entities/person.entity';
import {
  AirplaneModel,
  BookModel,
  CarModel,
  ComputerModel,
  SingleBaseModel,
} from './entities/inheritance.entity';
import { ProfileModel } from './entities/profile.entity';
import { TagModel } from './entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserStudyModel,
      StudentModel,
      TeacherModel,
      BookModel,
      CarModel,
      ComputerModel,
      AirplaneModel,
      SingleBaseModel,
      ProfileModel,
      TagModel,
    ]),
  ],
  controllers: [StudyController],
  providers: [StudyService],
})
export class StudyModule {}
