import { BaseModel } from './base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { join } from 'path';
import {POST_IMAGE_PATH, POST_PUBLIC_PATH} from '../const/path.const';
import { PostModel } from '../../posts/entities/posts.entity';

export enum ImageType {
  POST_IMAGE,
}

@Entity()
export class ImageModel extends BaseModel {
  @Column({
    default: 0,
  })
  @IsInt()
  @IsOptional()
  order: number;

  @Column({
    enum: ImageType,
  })
  @IsEnum(ImageType)
  @IsString()
  type: ImageType;

  @Column()
  @IsString()
  @Transform(({ value, obj }) => {
    if (obj.type === ImageType.POST_IMAGE) {
      return `/${join(POST_PUBLIC_PATH, value)}`;
    } else {
      return value;
    }
  })
  path: string;

  @ManyToOne(() => PostModel, (post) => post.images)
  post?: PostModel;
}
