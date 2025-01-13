import { ClassSerializerInterceptor, Module } from '@nestjs/common';
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
import { CommonModule } from './common/common.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import {
  ENV_DB_DATABASE_KEY,
  ENV_DB_HOST_KEY,
  ENV_DB_PASSWORD_KEY,
  ENV_DB_PORT_KEY,
  ENV_DB_USERNAME_KEY,
} from './common/const/env-keys.const';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PUBLIC_FOLDER_PATH } from './common/const/path.const';
import { ImageModel } from './common/entities/image.entity';
import { ChatsModule } from './chats/chats.module';
import { ChatsModel } from './chats/entities/chats.entity';
import { MessagesModel } from './chats/messages/entities/messages.entity';
import { CommentsModule } from './posts/comments/comments.module';
import { CommentModel } from './posts/comments/entities/comment.entity';

@Module({
  imports: [
    PostsModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      //데이터베이스 타입
      type: 'postgres',
      host: process.env[ENV_DB_HOST_KEY],
      port: parseInt(process.env[ENV_DB_PORT_KEY]),
      username: process.env[ENV_DB_USERNAME_KEY],
      password: process.env[ENV_DB_PASSWORD_KEY],
      database: process.env[ENV_DB_DATABASE_KEY],
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
        ImageModel,
        ChatsModel,
        MessagesModel,
        CommentModel,
      ],
      synchronize: true, // 개발환경에서만 true
      // logging: true,
    }),
    StudyModule,
    UsersModule,
    AuthModule,
    CommonModule,
    ServeStaticModule.forRoot({
      //http://localhost:3000/posts/xxx.png
      rootPath: PUBLIC_FOLDER_PATH,
      serveRoot: '/public',
    }),
    ChatsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
