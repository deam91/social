import { IsNumber, IsBoolean, IsString } from 'class-validator';

export class LikeDislikeDto {
  @IsString()
  userId: string;

  @IsNumber()
  postId: string;

  @IsBoolean()
  like: boolean;

  constructor(userId: string, postId: string, like: boolean) {
    this.userId = userId;
    this.postId = postId;
    this.like = like;
  }
}
