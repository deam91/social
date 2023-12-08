import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Post } from './post.entity';
import {UserItem} from "../../users/entities/user-item.entity";

@Entity()
export class PostLike {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Post, post => post.likes)
    post: Post;

    @ManyToOne(() => UserItem)
    user: UserItem;

    @Column()
    liked: boolean; // true for like, false for dislike
}
