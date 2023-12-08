import {
  Controller,
  Post,
  Body,
  Param,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostRequestDto } from './dto/create-post.dto';
import { LikeDislikeDto } from './dto/like_dislike.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: PostRequestDto) {
    try {
      return this.postsService.create(createPostDto);
    } catch (e) {
      if (e instanceof BadRequestException) throw e;
      throw new InternalServerErrorException();
    }
  }

  @Post(':postId/like')
  async like(
    @Param('postId') postId: number,
    @Body('userId') userId: number,
    @Body('like') like: boolean,
  ) {
    try {
      const likeModel = new LikeDislikeDto(userId, postId, like);
      return this.postsService.like(likeModel);
    } catch (e) {
      if (e instanceof BadRequestException) throw e;
      throw new InternalServerErrorException();
    }
  }
}
