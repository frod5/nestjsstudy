import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class UserModel {
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

  @Column()
  @Generated('uuid')
  additionalId: string;
}
