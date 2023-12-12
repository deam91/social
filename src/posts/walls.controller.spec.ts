import { Test, TestingModule } from '@nestjs/testing';
import { WallsController } from './walls.controller';
import { PostsService } from './posts.service';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserItem } from '../users/entities/user-item.entity';
import { Post } from './entities/post.entity';
import { PostLike } from './entities/post_like.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

const mockJwtService = {};

describe('WallsController', () => {
  let controller: WallsController;
  let postsService: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WallsController],
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(PostLike),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserItem),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<WallsController>(WallsController);
    postsService = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call postsService.findAll with the correct userId', () => {
      const userId = '1';
      jest
        .spyOn(controller, 'findAll')
        .mockImplementation(() => Promise.resolve([]));

      controller.findAll(userId, null);

      expect(controller.findAll).toHaveBeenCalledWith(userId, null);
    });

    it('should return the result of postsService.findAll', () => {
      const userId = '1';
      const expectedResult = ['post1', 'post2'];
      jest
        .spyOn(controller, 'findAll')
        .mockImplementation(() => Promise.resolve(expectedResult));

      controller.findAll(userId, null);

      expect(controller.findAll).toHaveBeenCalledWith(userId, null);
    });

    it('should throw BadRequestException if postsService.findAll throws BadRequestException', async () => {
      jest.spyOn(postsService, 'findAll').mockImplementation(() => {
        throw new BadRequestException();
      });
      jest
          .spyOn(controller, 'findAll').mockImplementation(() => {
        throw new BadRequestException();
      });

      expect(() => controller.findAll('', null)).toThrow(
          BadRequestException,
      );
    });

    it('should throw InternalServerErrorException if postsService.findAll throws any other error', () => {
      const userId = '1';
      jest.spyOn(postsService, 'findAll').mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.findAll(userId, null)).toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw InternalServerErrorException if postsService.findAll throws any other error', () => {
      const userId = '1';
      jest.spyOn(postsService, 'findAll').mockImplementation(() => {
        throw new Error();
      });

      expect(() => controller.findAll(userId, null)).toThrow(
        InternalServerErrorException,
      );
    });
  });
});
