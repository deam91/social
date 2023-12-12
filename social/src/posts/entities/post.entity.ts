import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserItem } from '../../users/entities/user-item.entity';
import { PostLike } from './post_like.entity';

export enum PostVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string; // Primary key

  @Column()
  text: string; // Assuming 'text' is of type string

  @CreateDateColumn()
  postedOn?: Date; // Automatically set the date when the post is created

  @Column({
    type: 'enum',
    enum: PostVisibility,
    default: PostVisibility.PRIVATE,
  })
  visibility: PostVisibility;

  @OneToMany(() => PostLike, (postLike) => postLike.post)
  likes: PostLike[];

  @ManyToOne(() => UserItem, (userItem) => userItem.posts)
  user: UserItem;
}
