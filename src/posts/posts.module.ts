import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModel } from './entities/posts.entity';
import { CommonModule } from '../common/common.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ImageModel } from '../common/entities/image.entity';
import { PostImagesService } from './image/image.service';
import { LogMiddleware } from '../common/middleware/log.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostModel, ImageModel]),
    CommonModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostImagesService],
})
export class PostsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LogMiddleware)
      .forRoutes({ path: 'posts*', method: RequestMethod.GET });
  }
}
