import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModel } from './posts/entities/posts.entity';
import { StudyModule } from './study/study.module';
import { UserStudyModel } from './study/entities/user.entity';
import { StudentModel, TeacherModel } from './study/entities/person.entity';
import {
  AirplaneModel,
  BookModel,
  CarModel,
  ComputerModel,
  SingleBaseModel,
} from './study/entities/inheritance.entity';
import { ProfileModel } from './study/entities/profile.entity';
import { TagModel } from './study/entities/tag.entity';
import { UsersModule } from './users/users.module';
import { UsersModel } from './users/entities/users.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PostsModule,
    TypeOrmModule.forRoot({
      //데이터베이스 타입
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [
        PostModel,
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
        UsersModel,
      ],
      synchronize: true, // 개발환경에서만 true
    }),
    StudyModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
