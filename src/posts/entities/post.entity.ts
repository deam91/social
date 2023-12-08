import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany} from 'typeorm';
import {UserItem} from "../../users/entities/user-item.entity";
import {PostLike} from "./post_like.entity";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number; // Primary key

    @Column()
    text: string; // Assuming 'text' is of type string

    @CreateDateColumn()
    postedOn?: Date; // Automatically set the date when the post is created

    @Column({default: 'private'})
    visibility: string;

    @OneToMany(() => PostLike, postLike => postLike.post)
    likes: PostLike[];

    @ManyToOne(() => UserItem, userItem => userItem.posts)
    user: UserItem;
}
