import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsIn, IsUUID } from 'class-validator';

enum VisibilityType {
  public = 'public',
  private = 'private',
}

export class PostRequestDto {
  @IsUUID()
  userId: string; // assuming userId is a number

  @IsString()
  text: string; // assuming text is a string

  @IsOptional()
  @IsString()
  @IsIn(['public', 'private'])
  @ApiProperty({
    enum: VisibilityType,
    enumName: 'VisibilityType',
    example: [VisibilityType.private, VisibilityType.public],
  })
  visibility?: 'public' | 'private'; // enum-like field for visibility
}

export class PostCreateSuccessDto {
  constructor(postId: string) {
    this.postId = postId;
  }

  @IsNumber()
  postId: string;
}
