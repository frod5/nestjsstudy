import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileModel } from './entities/profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
  ) {}

  async findAll() {
    /*return this.userRepository.find({
      select: {
        id: true,
        title: true,
      },
    });*/

    return this.userRepository.find({
      relations: {
        profile: true,
      },
    });
  }

  async findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async remove(id: number) {
    return this.userRepository.delete(id);
  }

  async create(title: string) {
    return this.userRepository.save(
      this.userRepository.create({
        title,
      }),
    );
  }

  async patch(id: number, title: string) {
    const find = await this.findOne(id);
    find.title = title;
    return this.userRepository.save(find);
  }

  async createUserAndProfile() {
    const user = await this.userRepository.save({
      email: 'xxx@naver.com',
      title: 'title1',
    });

    const profile = await this.profileRepository.save({
      profileImg: 'profile.png',
      user,
    });

    return user;
  }
}
