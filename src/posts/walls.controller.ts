import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('walls')
export class WallsController {
  constructor(private readonly postsService: PostsService) {}

  @Get(':userId')
  findAll(@Param('userId') userId: number) {
    try {
      return this.postsService.findAll(userId);
    } catch (e) {
      if (e instanceof BadRequestException) throw e;
      throw new InternalServerErrorException();
    }
  }
}
