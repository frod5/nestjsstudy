import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { UsersModel } from './entities/users.entity';
import { UserFollowersModel } from './entities/user-followers.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
    @InjectRepository(UserFollowersModel)
    private readonly userFollowersRepository: Repository<UserFollowersModel>,
  ) {}

  async createUser(user: Pick<UsersModel, 'nickname' | 'email' | 'password'>) {
    // 1) nickname 중복체크
    // exist() -> 존재하면 true
    const nicknameExists = await this.usersRepository.exists({
      where: {
        nickname: user.nickname,
      },
    });

    if (nicknameExists) {
      throw new BadRequestException('User with nickname already exists');
    }

    const emailExists = await this.usersRepository.exists({
      where: {
        email: user.email,
      },
    });

    if (emailExists) {
      throw new BadRequestException('User with email already exists');
    }

    const createUser = this.usersRepository.create({
      nickname: user.nickname,
      email: user.email,
      password: user.password,
    });

    return await this.usersRepository.save(createUser);
  }

  async getAllUsers() {
    return await this.usersRepository.find();
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  async followUser(followerId: number, foloweeId: number, qr?: QueryRunner) {
    await this.getUserFollowRepository(qr).save({
      follower: { id: followerId },
      followee: { id: foloweeId },
    });

    return true;
  }

  async getFollowers(userId: number, includeNotConfirmed: boolean) {
    const where = {
      followee: {
        id: userId,
      },
    };

    if (!includeNotConfirmed) {
      where['isConfirmed'] = true;
    }

    const result = await this.userFollowersRepository.find({
      where,
      relations: {
        follower: true,
        followee: true,
      },
    });

    return result.map((x) => ({
      id: x.follower.id,
      nickname: x.follower.nickname,
      email: x.follower.email,
      isConfirmed: x.isConfirmed,
    }));
  }

  async confirmFollow(followerId: number, foloweeId: number, qr?: QueryRunner) {
    const existing = await this.getUserFollowRepository(qr).findOne({
      where: {
        follower: {
          id: followerId,
        },
        followee: {
          id: foloweeId,
        },
      },
      relations: ['follower', 'followee'],
    });

    if (!existing) {
      throw new BadRequestException('존재하지 않는 팔로우 요청입니다.');
    }

    await this.getUserFollowRepository(qr).save({
      ...existing,
      isConfirmed: true,
    });

    return true;
  }

  async deleteFollow(followerId: number, followeeId: number, qr?: QueryRunner) {
    await this.getUserFollowRepository(qr).delete({
      follower: {
        id: followerId,
      },
      followee: {
        id: followeeId,
      },
    });

    return true;
  }

  getUserRepository(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository(UsersModel) : this.usersRepository;
  }

  getUserFollowRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository(UserFollowersModel)
      : this.userFollowersRepository;
  }

  async incrementFollowerCount(userId: number, qr?: QueryRunner) {
    await this.getUserRepository(qr).increment(
      {
        id: userId,
      },
      'followerCount',
      1,
    );
  }

  async decrementFollowerCount(userId: number, qr?: QueryRunner) {
    await this.getUserRepository(qr).decrement(
      {
        id: userId,
      },
      'followerCount',
      1,
    );
  }
}
