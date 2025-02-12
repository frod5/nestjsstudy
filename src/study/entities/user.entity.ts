import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { ProfileModel } from './profile.entity';
import { CarModel } from './inheritance.entity';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class UserStudyModel {
  //ID
  // 자동으로 ID 생성
  // @PrimaryGeneratedColumn()
  // @PrimaryColumn()은 기본키 생성이지만 자동으로 생성되진 않는다.

  // @PrimaryGeneratedColumn('uuid')
  // PrimaryGeneratedColumn -> 순서대로 위로 올라간다.
  // 1, 2, 3, 4 ... 999

  //UUID
  //adfasdfasdf-sdafasdfsadf-sadfasdfasdf-sadfasdf
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({
    //데이터베이스에서 인지하는 컬럼 타입
    //자동으로 유추됨.
    type: 'varchar',

    //데이터베이스 컬럼 이름
    //property 이름으로 자동 유추
    name: 'title',

    //값의 길이
    length: 300,

    // null 가능 여부
    nullable: true,

    // true면 처음 저장할때만 값 지정 가능.
    update: true,

    // 기본값 true
    // find()를 실행할 때 기본으로 값을 불러올지
    select: true,

    // 기본값
    // 입력이 없을 경우 해당 값으로 지정.
    default: 'default value',

    // 컬럼중 유일무이한 값이 되어야하는지.
    unique: false,
  })
  title: string;

  //데이터 생성 일자
  // 생성일자 자동 생성
  @CreateDateColumn()
  createdAt: Date;

  //데이터 업데이트 일자
  // 데이터가 업데이트 되는 날짜 자동으로 업뎃
  @UpdateDateColumn()
  updatedAt: Date;

  //데이터가 업데이트 될때마다 1씩 올라간다
  // 처음 생성되면 값은 1
  // save() 함수가 몇번 불렸는지 기억
  @VersionColumn()
  version: number;

  // enum
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column()
  @Generated('uuid')
  additionalId: string;

  @OneToOne(() => ProfileModel, (profile) => profile.user, {
    //find() 할때 항상 가져옴.
    eager: true,
    // 저장할때 한번에 저장가능.
    cascade: true,
    // 널 가능 여부
    nullable: true,
    //관계가 삭제 됐을때
    // no action -> 아무것도 하지 않음
    // cascade -> 참조하는 row도 삭제
    // set null -> 참조하는 row 참조 Id 를 null로 변경
    // set default -> 기본 세팅으로 설정
    // restrict -> 참조하고 있는 row가 있는 경우 참조 당하는 row 삭제 불가
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  profile: ProfileModel;

  @OneToMany(() => CarModel, (car) => car.onwer)
  cars: CarModel[];

  @Column({
    default: 0,
  })
  count: number;
}
