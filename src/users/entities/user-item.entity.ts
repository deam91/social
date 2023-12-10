import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';

@Entity()
export class UserItem {
  @PrimaryGeneratedColumn('uuid')
  userId: string; // Assuming 'userId' is of type number

  @Column()
  fullName: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @ManyToMany(() => UserItem)
  @JoinTable()
  friends: UserItem[];

  @ManyToMany(() => UserItem)
  @JoinTable()
  following: UserItem[];
}
