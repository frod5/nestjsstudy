import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async followUser(followerId: number, foloweeId: number) {
    await this.userFollowersRepository.save({
      follower: { id: followerId },
      followee: { id: foloweeId },
    });

    return true;
  }

  async getFollowers(userId: number) {
    const result = await this.userFollowersRepository.find({
      where: {
        followee: {
          id: userId,
        },
      },
      relations: {
        follower: true,
        followee: true,
      },
    });

    return result.map((x) => x.follower);
  }
}
