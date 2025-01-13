import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentModel } from './entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from '../../common/common.service';
import { CommonModule } from '../../common/common.module';
import { AuthModule } from '../../auth/auth.module';
import { UsersModule } from '../../users/users.module';
import { PostExistsMiddleware } from '../middleware/post-exists.middleware';
import { PostsModule } from '../posts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentModel]),
    CommonModule,
    UsersModule,
    AuthModule,
    PostsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommonService],
})
export class CommentsModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(PostExistsMiddleware).forRoutes(CommentsController);
  }
}
