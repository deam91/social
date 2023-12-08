import { Test, TestingModule } from '@nestjs/testing';
import { WallsController } from './walls.controller';
import { PostsService } from './posts.service';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserItem } from '../users/entities/user-item.entity';
import { Post } from './entities/post.entity';
import { PostLike } from './entities/post_like.entity';
import { DataSource } from 'typeorm';

describe('WallsController', () => {
  let controller: WallsController;
  let postsService: PostsService;
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
      controllers: [WallsController],
      providers: [PostsService],
    }).compile();

    controller = module.get<WallsController>(WallsController);
    postsService = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call postsService.findAll with the correct userId', () => {
      const userId = 1;
      const findAllSpy = jest.spyOn(postsService, 'findAll');

      controller.findAll(userId);

      expect(findAllSpy).toHaveBeenCalledWith(userId);
    });

    it('should return the result of postsService.findAll', () => {
      const userId = 1;
      const expectedResult = ['post1', 'post2'];
      jest
        .spyOn(postsService, 'findAll')
        .mockReturnValue(Promise.resolve(expectedResult));

      const result = controller.findAll(userId);

      expect(result).toEqual(expectedResult);
    });

    it('should throw BadRequestException if postsService.findAll throws BadRequestException', () => {
      const userId = 1;
      jest.spyOn(postsService, 'findAll').mockImplementation(() => {
        throw new BadRequestException();
      });

      expect(() => controller.findAll(userId)).toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException if postsService.findAll throws any other error', () => {
      const userId = 1;
      jest.spyOn(postsService, 'findAll').mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.findAll(userId)).toThrow(
        InternalServerErrorException,
      );
    });
  });
});
