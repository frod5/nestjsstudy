import { BadRequestException, Module } from '@nestjs/common';
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
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { POST_IMAGE_PATH } from '../common/const/path.const';
import { v4 as uuid } from 'uuid';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostModel, UsersModel]),
    CommonModule,
    AuthModule,
    UsersModule,
    MulterModule.register({
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
      fileFilter: function (req, file, cb) {
        /**
         * cb(error, )
         *
         * 첫번째 파라미터는 에러가 있을 경우 에러정보를 넣어준다.
         * 두번째 파라미터는 파일을 받을지 말지 boolean으로 넣어준다.
         */
        const ext = extname(file.originalname);
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
          return cb(new BadRequestException('only jpg, jpeg, png!'), false);
        }

        return cb(null, true);
      },
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, POST_IMAGE_PATH);
        },
        filename: function (req, file, cb) {
          cb(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [PostsController],
  providers: [PostsService, AuthService, UsersService, JwtService],
})
export class PostsModule {}
