import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  async findAll() {
    return this.userRepository.find();
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
}
