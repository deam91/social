import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRequestDto } from './dto/create-user.dto';
import {
  BadRequestException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { UserItem } from './entities/user-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeAll(async () => {
    const dataSource = new DataSource({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'social',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    });
    await dataSource.initialize();
  });

  beforeEach(async () => {
    const dataSource = new DataSource({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'social',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    });
    await dataSource.initialize();
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([UserItem])],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user and return the user ID', async () => {
      const createUserDto: UserRequestDto = {
        fullName: '123',
      };
      const createdUser: UserItem = {
        fullName: '123',
        posts: [],
        friends: [],
        following: [],
        userId: 1,
      };

      jest.spyOn(usersService, 'create').mockResolvedValue(createdUser);

      const result = await controller.create(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toBe(createdUser.userId);
    });
  });

  describe('addFriend', () => {
    it('should add a friend and return the response', async () => {
      const userId = 1;
      const friendId = 2;

      jest.spyOn(usersService, 'friendship');

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await controller.addFriend(res as unknown as Response, userId, friendId);

      expect(usersService.friendship).toHaveBeenCalledWith(userId, friendId);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('should handle errors and throw appropriate exceptions', async () => {
      const userId = 1;
      const friendId = 2;
      const error = new BadRequestException();

      jest.spyOn(usersService, 'friendship').mockRejectedValue(error);

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await expect(
        controller.addFriend(res as unknown as Response, userId, friendId),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('follow', () => {
    it('should follow a user and return the response', async () => {
      const userId = 1;
      const followerId = 2;

      jest.spyOn(usersService, 'follow');

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await controller.follow(res as unknown as Response, userId, followerId);

      expect(usersService.follow).toHaveBeenCalledWith(userId, followerId);
    });

    it('should handle errors and throw appropriate exceptions', async () => {
      const userId = 1;
      const followerId = 2;
      const error = new BadRequestException();

      jest.spyOn(usersService, 'follow').mockRejectedValue(error);

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await expect(
        controller.follow(res as unknown as Response, userId, followerId),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
