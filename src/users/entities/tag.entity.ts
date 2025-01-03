import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CarModel } from './inheritance.entity';

@Entity()
export class TagModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => CarModel, (car) => car.tags)
  cars: CarModel[];

  @Column()
  name: string;
}
