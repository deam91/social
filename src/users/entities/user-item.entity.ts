import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable} from 'typeorm';
import {Post} from "../../posts/entities/post.entity";

@Entity()
export class UserItem {
    @PrimaryGeneratedColumn()
    userId: number; // Assuming 'userId' is of type number

    @Column()
    fullName: string;

    @OneToMany(() => Post, post => post.user)
    posts: Post[];

    @ManyToMany(() => UserItem)
    @JoinTable()
    friends: UserItem[];

    @ManyToMany(() => UserItem)
    @JoinTable()
    following: UserItem[];
}
