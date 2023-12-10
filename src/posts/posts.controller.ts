import {
  Controller,
  Post,
  Body,
  Param,
  BadRequestException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostRequestDto } from './dto/create-post.dto';
import { LikeDislikeDto } from './dto/like_dislike.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createPostDto: PostRequestDto) {
    try {
      return this.postsService.create(createPostDto);
    } catch (e) {
      if (e instanceof BadRequestException) throw e;
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(AuthGuard)
  @Post(':postId/like')
  async like(
    @Param('postId') postId: string,
    @Body('userId') userId: string,
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
