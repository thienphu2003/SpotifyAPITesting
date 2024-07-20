import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from 'typeorm';

// Entities
import { BaseEntity } from '../base/base.entity';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  @Unique(['email'])
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  role: string;
}
