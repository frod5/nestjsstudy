import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModel } from './entities/posts.entity';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { UsersModel } from '../users/entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import { CommonModule } from '../common/common.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostModel, UsersModel]),
    CommonModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, AuthService, UsersService, JwtService],
})
export class PostsModule {}
