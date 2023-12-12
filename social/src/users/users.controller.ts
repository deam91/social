import {
  Controller,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
  InternalServerErrorException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRequestDto } from './dto/create-user.dto';
import { Type200 } from '../core/dto/types';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { Public } from '../core/constants';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: UserRequestDto) {
    const user = await this.usersService.create(createUserDto);
    return user.userId;
  }

  @UseGuards(AuthGuard)
  @Post(':userId/friends/:friendId')
  async addFriend(
    @Res() res: Response,
    @Param('userId') userId: string,
    @Param('friendId') friendId: string,
  ) {
    try {
      const resp = await this.usersService.friendship(userId, friendId);
      if (resp instanceof Type200) {
        res.status(HttpStatus.OK).json(resp);
      }
      return resp;
    } catch (e) {
      if (e instanceof BadRequestException) throw e;
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(AuthGuard)
  @Post(':userId/followers/:followerId')
  async follow(
    @Res() res: Response,
    @Param('userId') userId: string,
    @Param('followerId') followerId: string,
  ) {
    try {
      const resp = await this.usersService.follow(userId, followerId);
      if (resp instanceof Type200) {
        res.status(HttpStatus.OK).json(resp);
      }
      return resp;
    } catch (e) {
      if (e instanceof BadRequestException) throw e;
      throw new InternalServerErrorException();
    }
  }
}
