import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { PostModel } from './entities/posts.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { CommonService } from '../common/common.service';
import { basename, join } from 'path';
import {POST_IMAGE_PATH, POST_PUBLIC_PATH, PUBLIC_FOLDER_PATH, TEMP_FOLDER_PATH} from '../common/const/path.const';
import { promises } from 'fs';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostModel)
    private readonly postsRepository: Repository<PostModel>,
    private readonly commonService: CommonService,
  ) {}

  async getAllPosts() {
    return this.postsRepository.find({
      relations: ['author'],
    });
  }

  async generatePosts(userId: number) {
    for (let i = 0; i < 100; i++) {
      await this.createPost(userId, {
        title: `임의 생성 포스트 title${i}`,
        content: `임의 생성 포스트 content${i}`,
      });
    }
  }

  async paginatePosts(query: PaginatePostDto) {
    return this.commonService.pagenate(
      query,
      this.postsRepository,
      {
        relations: ['author'],
      },
      'posts',
    );
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async createPostImage(dto: CreatePostDto) {
    //dto의 이미지 이름을 기반으로
    //파일의 경로를 생성한다.
    const tempFilePath = join(TEMP_FOLDER_PATH, dto.image);

    try {
      //파일이 존재하는지 확인
      await promises.access(tempFilePath);
    } catch (e) {
      throw new BadRequestException('존재하지 않는 파일입니다.');
    }

    //파일 이름만 가져오기
    const fileName = basename(tempFilePath);

    //새로 이동할 포스트 폴더의 경로
    // /{프로젝트의 위치}/public/posts
    const newPath = join(POST_IMAGE_PATH, fileName);

    //파일 옮기기
    await promises.rename(tempFilePath, newPath);
    return true;
  }

  async createPost(authorId: number, postDto: CreatePostDto) {
    //1) create - 객체 생성
    //2) save - 객체 저장
    const post = this.postsRepository.create({
      author: {
        id: authorId,
      },
      ...postDto,
      likeCount: 0,
      commentCount: 0,
    });

    return await this.postsRepository.save(post);
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto) {
    // save의 기능
    // 1) 만약에 데이터가 존재하지 않는다면 (id 기준으로) 새로 생성한다.
    // 2) 만약에 데이터가 존재한다면 (같은 id의 값이 존재한다면) 존재하던 값을 업데이트한다.
    const post = await this.getPostById(id);
    const { title, content } = updatePostDto;

    if (title) post.title = title;
    if (content) post.content = content;
    return await this.postsRepository.save(post);
  }

  async deletePost(id: number) {
    await this.postsRepository.delete(id);
    return id;
  }
}
