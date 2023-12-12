import { IsOptional, IsNumber, IsString, IsIn } from 'class-validator';

export class PostRequestDto {
  @IsString()
  userId: string; // assuming userId is a number

  @IsString()
  text: string; // assuming text is a string

  @IsOptional()
  @IsString()
  @IsIn(['public', 'private'])
  visibility?: 'public' | 'private'; // enum-like field for visibility
}

export class PostCreateSuccessDto {
  constructor(postId: string) {
    this.postId = postId;
  }

  @IsNumber()
  postId: string;
}
