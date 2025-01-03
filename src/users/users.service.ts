import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entities/user.entity';
import {
  Between,
  Equal,
  ILike,
  In, IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository
} from "typeorm";
import { ProfileModel } from './entities/profile.entity';
import { CarModel } from './entities/inheritance.entity';
import { TagModel } from './entities/tag.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
    @InjectRepository(CarModel)
    private readonly carRepository: Repository<CarModel>,
    @InjectRepository(TagModel)
    private readonly tagRepository: Repository<TagModel>,
  ) {}

  async findAll() {
    /*return this.userRepository.find({
      //어떤 프로퍼티를 선택할지
      //기본은 모든 프로퍼티를 가져온다
      //select를 정의하면 정의한 프로퍼티만 가져온다.
      select: {
        id: true,
        title: true,
        profile: {
          id: true,
        }
      },

      //필터링할 조건을 정의
      //기본적으로 and 연산
      //OR를 하고싶으면 리스트에 담으면된다
      //where: [
      //  {id:1},{version:2}
      //  profile: {id:3}
      //]
      where:{

      }

      //관계를 가져오는 법
      //select, where안에도 가능
      relations: {}

      //order
      order:{
        id: 'ASC',
      }

      //처음 몇개를 제외할지
      skip:{}

      //데이터 갯수
      take: 1,
    });*/

    return this.userRepository.find({
      relations: {
        cars: true,
      },
      where: {
        // id != 1
        // id: Not(1),

        // id < 30
        // id: LessThan(30),

        // id <= 30
        // id:LessThanOrEqual(30),

        // id > 30
        // id:MoreThan(30),

        // id >= 30
        // id: MoreThanOrEqual(30),

        // id = 30
        // id: Equal(30),

        //유사값
        // email: Like('%google%'),

        //대,소문자 구분 안하는 유사값
        // email:ILike('%GOOGLE%'),

        // 사이값
        // id: Between(20,30),

        // IN
        // id: In([3, 4, 6]),

        // is null
        // id: IsNull(),
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
      profile: {
        profileImg: 'teasd.png',
      },
    });

    // const profile = await this.profileRepository.save({
    //   profileImg: 'profile.png',
    //   user,
    // });

    return user;
  }

  async createUserAndCar() {
    const user = await this.userRepository.save({
      email: 'xxx@xxxxx.com',
      title: 'title2',
    });

    const car = await this.carRepository.save({
      brand: 'hyundai',
      onwer: user,
    });

    const car2 = await this.carRepository.save({
      brand: 'BMW',
      onwer: user,
    });

    return user;
  }

  async createTagAndCar() {
    const car = await this.carRepository.save({
      brand: 'hyundai1',
    });

    const car2 = await this.carRepository.save({
      brand: 'hyundai2',
    });

    const tag1 = await this.tagRepository.save({
      name: 'tag1',
      cars: [car, car2],
    });

    const tag2 = await this.tagRepository.save({
      name: 'tag2',
      cars: [car2],
    });

    const car3 = await this.carRepository.save({
      brand: 'hyundai3',
      tags: [tag1, tag2],
    });
  }

  async getAllCars() {
    return await this.carRepository.find({
      relations: {
        tags: true,
      },
    });
  }

  async getAllTags() {
    return await this.tagRepository.find({
      relations: {
        cars: true,
      },
    });
  }

  async deleteProfile(id: number) {
    return this.profileRepository.delete(id);
  }
}
