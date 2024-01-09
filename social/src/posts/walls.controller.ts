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
import { AnonymousOrAuthenticatedGuard } from '../auth/auth.guard';
import { rethrow } from '@nestjs/core/helpers/rethrow';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('walls')
export class WallsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AnonymousOrAuthenticatedGuard)
  @Get(':username')
  findAll(@Param('username') username: string, @Request() req) {
    try {
      return this.postsService.findAll(username, req.user);
    } catch (e) {
      if (e instanceof BadRequestException) rethrow(e);
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(AnonymousOrAuthenticatedGuard)
  @Get('')
  @ApiBearerAuth('JWT')
  find(@Request() req) {
    try {
      return this.postsService.findAll('', req.user);
    } catch (e) {
      if (e instanceof BadRequestException) throw e;
      throw new InternalServerErrorException();
    }
  }
}
