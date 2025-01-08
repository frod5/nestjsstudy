import { Injectable, NotFoundException } from '@nestjs/common';
import { PostModel } from './entities/posts.entity';
import { FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { HOST, PROTOCOL } from '../common/const/env.const';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostModel)
    private readonly postsRepository: Repository<PostModel>,
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
    if (query.page) {
      return this.pagePaginatePosts(query);
    } else {
      return this.cursiorPaginatePosts(query);
    }
  }

  async pagePaginatePosts(query: PaginatePostDto) {
    /**
     * data: Data[],
     * total: number,
     */
    const [result, total] = await this.postsRepository.findAndCount({
      skip: query.take * (query.page - 1),
      take: query.take,
      order: {
        createdAt: query.order__createdAt,
      },
    });

    return {
      data: result,
      total: total,
    };
  }

  // 1) 오름차순 정렬하는 pagination만 구현
  async cursiorPaginatePosts(query: PaginatePostDto) {
    const where: FindOptionsWhere<PostModel> = {};

    if (query.where__id_less_than) {
      where.id = LessThan(query.where__id_less_than);
    } else if (query.where__id_more_than) {
      where.id = MoreThan(query.where__id_more_than);
    }

    const result = await this.postsRepository.find({
      where: where,
      order: {
        createdAt: query.order__createdAt,
      },
      take: query.take,
    });

    const count = result.length;
    const lastItem =
      count > 0 && count === query.take ? result[count - 1] : null;

    const nextUrl = lastItem && new URL(`${PROTOCOL}://${HOST}/posts`);
    if (nextUrl) {
      /**
       * dto의 키값을 루핑하며
       * 키값에 해당하는 밸류가 존재하면
       * param에 붙여준다.
       *
       * 단, where__id_more_than 값만 lastItem.id를 넣어준다.
       */

      for (const key of Object.keys(query)) {
        if (
          query[key] &&
          key !== 'where__id_more_than' &&
          key !== 'where__id_less_than'
        ) {
          nextUrl.searchParams.append(key, query[key]);
        }
      }

      const key =
        query.order__createdAt === 'ASC'
          ? 'where__id_more_than'
          : 'where__id_less_than';

      nextUrl.searchParams.append(key, lastItem.id.toString());
    }

    /**
     * Response
     *
     * data: Data[],
     * cursor: {
     *     after: 마지막 data의 id
     * },
     * count: 조회된 데이터 갯수
     * next: 다음 요청에 사용할 URL
     */

    return {
      data: result,
      cursor: {
        after: lastItem?.id ?? null,
      },
      count: count,
      next: nextUrl?.toString() ?? null,
    };
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
