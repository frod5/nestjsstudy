import { Injectable, NotFoundException } from '@nestjs/common';
import { PostModel } from './entities/posts.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

let posts: PostModel[] = [
  {
    id: 1,
    author: 'kim',
    title: 'title1',
    content: 'content1',
    likeCount: 999,
    commentCount: 100,
  },
  {
    id: 2,
    author: 'lee',
    title: 'title2',
    content: 'content2',
    likeCount: 199,
    commentCount: 120,
  },
  {
    id: 3,
    author: 'park',
    title: 'title3',
    content: 'content3',
    likeCount: 99,
    commentCount: 10,
  },
];

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostModel)
    private readonly postsRepository: Repository<PostModel>,
  ) {}

  getAllPosts() {
    return posts;
  }

  getPostById(id: number) {
    const post = posts.find((post) => post.id === id);

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  createPost(author: string, title: string, content: string) {
    const post: PostModel = {
      id: posts[posts.length - 1].id + 1,
      author: author,
      title: title,
      content: content,
      likeCount: 0,
      commentCount: 0,
    };
    posts = [...posts, post];
    return post;
  }

  updatePost(id: number, author: string, title: string, content: string) {
    const post = posts.find((post) => post.id === id);
    if (!post) {
      throw new NotFoundException();
    }

    if (author) post.author = author;
    if (title) post.title = title;
    if (content) post.content = content;
    posts = posts.map((prev) => (prev.id === id ? post : prev));
    return post;
  }

  deletePost(id: number) {
    posts = posts.filter((post) => post.id !== id);
    return id;
  }
}
