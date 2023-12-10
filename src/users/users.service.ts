import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRequestDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { UserItem } from './entities/user-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Type200 } from '../core/dto/types';
import * as bcrypt from 'bcrypt';
import { saltOrRounds } from 'src/core/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserItem)
    private userItemRepository: Repository<UserItem>,
  ) {}

  async create(createUserDto: UserRequestDto): Promise<UserItem> {
    try {
      createUserDto.password = await bcrypt.hash(
        createUserDto.password,
        saltOrRounds,
      );
      return this.userItemRepository.save(createUserDto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async friendship(userId: string, friendId: string): Promise<Type200> {
    const user = await this.userItemRepository.findOne({
      where: { userId: userId },
      relations: ['friends'],
    });
    const friend = await this.userItemRepository.findOne({
      where: { userId: friendId },
    });

    if (!user || !friend) {
      throw new BadRequestException('One of the users were not found');
    }

    if (userId === friendId) {
      throw new BadRequestException('Can not add yourself as a friend');
    }

    if (user.friends.some((f) => f.userId === friendId)) {
      throw new BadRequestException('You are already friends');
    }

    user.friends.push(friend);
    await this.userItemRepository.save(user);

    return new Type200('Successfully completed the operation.');
  }

  async follow(userId: string, followerId: string): Promise<Type200> {
    const follower = await this.userItemRepository.findOne({
      where: { userId: followerId },
      relations: ['following'],
    });
    const followedUser = await this.userItemRepository.findOne({
      where: { userId: userId },
    });

    if (!followedUser || !follower) {
      throw new BadRequestException('One of the users were not found');
    }

    if (follower === followedUser) {
      throw new BadRequestException('You can not follow yourself');
    }

    if (follower.following.some((f) => f.userId === userId)) {
      throw new BadRequestException(
        `You are already following the user ${followedUser.fullName}`,
      );
    }

    follower.following.push(followedUser);
    await this.userItemRepository.save(follower);

    return new Type200('Successfully completed the operation.');
  }

  async findOne(username: string): Promise<UserItem | undefined> {
    return this.userItemRepository.findOne({ where: { username: username } });
  }
}
