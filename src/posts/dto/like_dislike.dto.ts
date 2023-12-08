import {IsNumber, IsBoolean} from 'class-validator';

export class LikeDislikeDto {
    @IsNumber()
    userId: number;

    @IsNumber()
    postId: number

    @IsBoolean()
    like: boolean

    constructor(userId: number, postId: number, like: boolean) {
        this.userId = userId;
        this.postId = postId;
        this.like = like;
    }
}