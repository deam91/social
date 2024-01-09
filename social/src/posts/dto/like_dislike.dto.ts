import { IsBoolean, IsUUID } from 'class-validator';

export class LikeDislikeDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  postId: string;

  @IsBoolean()
  like: boolean;

  constructor(userId: string, postId: string, like: boolean) {
    this.userId = userId;
    this.postId = postId;
    this.like = like;
  }
}
