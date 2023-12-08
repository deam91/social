import {
  Controller,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRequestDto } from './dto/create-user.dto';
import { Type200 } from '../core/dto/types';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: UserRequestDto) {
    const user = await this.usersService.create(createUserDto);
    return user.userId;
  }

  @Post(':userId/friends/:friendId')
  async addFriend(
    @Res() res: Response,
    @Param('userId') userId: number,
    @Param('friendId') friendId: number,
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

  @Post(':userId/followers/:followerId')
  async follow(
    @Res() res: Response,
    @Param('userId') userId: number,
    @Param('followerId') followerId: number,
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
