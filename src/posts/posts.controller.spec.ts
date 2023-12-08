import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PostRequestDto } from './dto/create-post.dto';
import { PostLike } from './entities/post_like.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { UserItem } from '../users/entities/user-item.entity';
import { DataSource } from 'typeorm';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;
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
      imports: [TypeOrmModule.forFeature([UserItem, Post, PostLike])],
      controllers: [PostsController],
      providers: [PostsService],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', () => {
      const createPostDto: PostRequestDto = {
        userId: 1,
        text: 'Sample post text',
        visibility: 'public',
      };

      jest.spyOn(service, 'create');
      expect(service.create).toHaveBeenCalledWith(createPostDto);
    });

    it('should throw BadRequestException when create fails', () => {
      const createPostDto: PostRequestDto = {
        userId: 1,
        text: 'Sample post text',
        visibility: 'public',
      };

      jest.spyOn(service, 'create').mockImplementation(() => {
        throw new BadRequestException();
      });

      expect(() => {
        controller.create(createPostDto);
      }).toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException when create fails', () => {
      const createPostDto: PostRequestDto = {
        userId: 1,
        text: 'Sample post text',
        visibility: 'public',
      };

      jest.spyOn(service, 'create').mockImplementation(() => {
        throw new Error();
      });

      expect(() => {
        controller.create(createPostDto);
      }).toThrow(InternalServerErrorException);
    });
  });

  describe('like', () => {
    it('should like a post', async () => {
      const postId = 1;
      const userId = 1;
      const like = true;
      const likeModel = {};
      const expectedResult = {};

      jest
        .spyOn(service, 'like')
        .mockReturnValue(Promise.resolve(expectedResult) as Promise<PostLike>);

      const result = await controller.like(postId, userId, like);

      expect(service.like).toHaveBeenCalledWith(likeModel);
      expect(result).toEqual(expectedResult);
    });

    it('should throw BadRequestException when like fails', async () => {
      const postId = 1;
      const userId = 1;
      const like = true;

      jest.spyOn(service, 'like').mockImplementation(() => {
        throw new BadRequestException();
      });

      await expect(controller.like(postId, userId, like)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException when like fails', async () => {
      const postId = 1;
      const userId = 1;
      const like = true;

      jest.spyOn(service, 'like').mockImplementation(() => {
        throw new Error();
      });

      await expect(controller.like(postId, userId, like)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
