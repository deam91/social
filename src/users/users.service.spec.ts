import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { UserItem } from './entities/user-item.entity';
import { UserRequestDto } from './dto/create-user.dto';
import { InternalServerErrorException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let userItemRepository: Repository<UserItem>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserItem),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userItemRepository = module.get<Repository<UserItem>>(
      getRepositoryToken(UserItem),
    );
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: UserRequestDto = {
        fullName: '123',
      };

      const saveSpy = jest
        .spyOn(userItemRepository, 'save')
        .mockResolvedValueOnce({} as UserItem);

      const result = await service.create(createUserDto);

      expect(saveSpy).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({} as UserItem);
    });

    it('should throw InternalServerErrorException when save fails', async () => {
      const createUserDto: UserRequestDto = {
        fullName: '123',
      };

      jest.spyOn(userItemRepository, 'save').mockRejectedValueOnce(new Error());

      await expect(service.create(createUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('friendship', () => {
    it('should create a friendship between two users', async () => {
      const userId = 1;
      const friendId = 2;

      const user = {} as UserItem;
      const friend = {} as UserItem;

      jest.spyOn(userItemRepository, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(userItemRepository, 'findOne').mockResolvedValueOnce(friend);
      jest.spyOn(userItemRepository, 'save').mockResolvedValueOnce(user);

      const result = await service.friendship(userId, friendId);

      expect(userItemRepository.findOne).toHaveBeenCalledWith({
        where: { userId: userId },
        relations: ['friends'],
      });
      expect(userItemRepository.findOne).toHaveBeenCalledWith({
        where: { userId: friendId },
      });
      expect(user.friends).toContain(friend);
      expect(userItemRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual({
        message: 'Successfully completed the operation.',
      });
    });
  });

  describe('follow', () => {
    it('should create a follow relationship between two users', async () => {
      const userId = 1;
      const followerId = 2;

      const follower = {} as UserItem;
      const followedUser = {} as UserItem;

      jest.spyOn(userItemRepository, 'findOne').mockResolvedValueOnce(follower);
      jest
        .spyOn(userItemRepository, 'findOne')
        .mockResolvedValueOnce(followedUser);
      jest.spyOn(userItemRepository, 'save').mockResolvedValueOnce(follower);

      const result = await service.follow(userId, followerId);

      expect(userItemRepository.findOne).toHaveBeenCalledWith({
        where: { userId: followerId },
        relations: ['following'],
      });
      expect(userItemRepository.findOne).toHaveBeenCalledWith({
        where: { userId: userId },
      });
      expect(follower.following).toContain(followedUser);
      expect(userItemRepository.save).toHaveBeenCalledWith(follower);
      expect(result).toEqual({
        message: 'Successfully completed the operation.',
      });
    });
  });
});
