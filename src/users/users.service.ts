import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersModel } from './entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
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
    const user = await this.usersRepository.findOne({
      where: {
        id: followerId,
      },
      relations: ['followees'],
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.usersRepository.save({
      ...user,
      followees: [
        ...user.followees,
        {
          id: foloweeId,
        },
      ],
    });
  }

  async getFollowers(userId: number) {
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['followers'],
    });

    return user.followers;
  }
}
