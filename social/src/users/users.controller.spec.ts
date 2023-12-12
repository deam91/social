import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRequestDto } from './dto/create-user.dto';
import {
  BadRequestException,
  HttpStatus,
  InternalServerErrorException, SetMetadata,
} from '@nestjs/common';
import { Response } from 'express';
import { UserItem } from './entities/user-item.entity';
import {getRepositoryToken, TypeOrmModule} from '@nestjs/typeorm';
import {DataSource, Repository} from 'typeorm';
import {JwtService} from "@nestjs/jwt";
import {Type200} from "../core/dto/types";

const mockRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
};

const mockJwtService = {};

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

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
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserItem),
          useValue: mockRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
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
        username: '123',
        password: '123',
      };
      const createdUser: UserItem = {
        fullName: '123',
        username: '123',
        password: '123',
        posts: [],
        friends: [],
        following: [],
        userId: '1',
      };

      jest.spyOn(usersService, 'create').mockResolvedValue(createdUser);

      const result = await controller.create(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toBe(createdUser.userId);
    });
  });

  describe('addFriend', () => {
    it('should add a friend and return the response', async () => {
      const userId = '59759d0a-7de7-4595-b1b1-650d757e3893';
      const friendId = 'ce62799d-c123-490b-a434-3fd49e4db75d';

      jest.spyOn(usersService, 'friendship').mockImplementation((e) => Promise.resolve(new Type200('')));

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await controller.addFriend(res as unknown as Response, userId, friendId);

      expect(usersService.friendship).toHaveBeenCalledWith(userId, friendId);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('should handle errors and throw appropriate exceptions', async () => {
      const userId = '59759d0a-7de7-4595-b1b1-650d757e3893';
      const friendId = 'ce62799d-c123-490b-a434-3fd49e4db75d';
      const error = new BadRequestException();

      jest.spyOn(usersService, 'friendship').mockRejectedValue(error);

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await expect(
        controller.addFriend(res as unknown as Response, userId, friendId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('follow', () => {
    it('should follow a user and return the response', async () => {
      const userId = '59759d0a-7de7-4595-b1b1-650d757e3893';
      const followerId = 'ce62799d-c123-490b-a434-3fd49e4db75d';

      jest.spyOn(usersService, 'follow').mockImplementation((e) => Promise.resolve(new Type200('')));

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await controller.follow(res as unknown as Response, userId, followerId);

      expect(usersService.follow).toHaveBeenCalledWith(userId, followerId);
    });

    it('should handle errors and throw appropriate exceptions', async () => {
      const userId = '59759d0a-7de7-4595-b1b1-650d757e3893';
      const followerId = 'ce62799d-c123-490b-a434-3fd49e4db75d';
      const error = new BadRequestException();

      jest.spyOn(usersService, 'follow').mockRejectedValue(error);

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await expect(
        controller.follow(res as unknown as Response, userId, followerId),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
