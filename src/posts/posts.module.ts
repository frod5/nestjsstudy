import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModel } from './entities/posts.entity';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { UsersModel } from '../users/entities/users.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([PostModel, UsersModel])],
  controllers: [PostsController],
  providers: [PostsService, AuthService, UsersService, JwtService],
})
export class PostsModule {}
