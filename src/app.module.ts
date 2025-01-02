import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModel } from './posts/entities/posts.entity';
import { UsersModule } from './users/users.module';
import { UserModel } from './users/entities/user.entity';
import { StudentModel, TeacherModel } from './users/entities/person.entity';
import {
  AirplaneModel,
  BookModel,
  CarModel,
  ComputerModel,
  SingleBaseModel,
} from './users/entities/inheritance.entity';

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
        UserModel,
        StudentModel,
        TeacherModel,
        BookModel,
        CarModel,
        ComputerModel,
        AirplaneModel,
        SingleBaseModel,
      ],
      synchronize: true, // 개발환경에서만 true
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
