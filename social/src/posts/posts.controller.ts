import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostRequestDto } from './dto/create-post.dto';
import { LikeDislikeDto } from './dto/like_dislike.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
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
  @ApiBearerAuth('JWT')
  @Post(':postId/like')
  async like(@Body() postLikeDto: LikeDislikeDto) {
    try {
      return this.postsService.like(postLikeDto);
    } catch (e) {
      if (e instanceof BadRequestException) throw e;
      throw new InternalServerErrorException();
    }
  }
}
