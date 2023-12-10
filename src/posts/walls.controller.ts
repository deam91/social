import {
  BadRequestException,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AnonymousOrAuthenticatedGuard } from 'src/auth/auth.guard';

@Controller('walls')
export class WallsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AnonymousOrAuthenticatedGuard)
  @Get(':username')
  findAll(@Param('username') username: string, @Request() req) {
    try {
      return this.postsService.findAll(username, req.user);
    } catch (e) {
      if (e instanceof BadRequestException) throw e;
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(AnonymousOrAuthenticatedGuard)
  @Get('')
  find(@Request() req) {
    try {
      return this.postsService.findAll('', req.user);
    } catch (e) {
      if (e instanceof BadRequestException) throw e;
      throw new InternalServerErrorException();
    }
  }
}
