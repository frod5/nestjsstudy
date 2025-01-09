import { BadRequestException, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { TEMP_FOLDER_PATH } from './const/path.const';
import { v4 as uuid } from 'uuid';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
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
          cb(null, TEMP_FOLDER_PATH);
        },
        filename: function (req, file, cb) {
          cb(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [CommonController],
  exports: [CommonService],
  providers: [CommonService],
})
export class CommonModule {}
