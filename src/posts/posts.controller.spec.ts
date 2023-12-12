import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PostRequestDto } from './dto/create-post.dto';
import { PostLike } from './entities/post_like.entity';
import {getRepositoryToken, TypeOrmModule} from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { UserItem } from '../users/entities/user-item.entity';
import { DataSource } from 'typeorm';
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";

const mockRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
};

const mockJwtService = {};

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

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
      controllers: [PostsController],
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(PostLike),
          useValue: mockRepository,
        },
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

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', () => {
      const createPostDto: PostRequestDto = {
        userId: '1',
        text: 'Sample post text',
        visibility: 'public',
      };

      jest.spyOn(service, 'create').mockImplementation();
      service.create(createPostDto);
      expect(service.create).toHaveBeenCalledWith(createPostDto);
    });

    it('should throw BadRequestException when create fails', () => {
      const createPostDto: PostRequestDto = {
        userId: '1',
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
        userId: '1',
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
      const postId = '1';
      const userId = '1';
      const like = true;
      const dto = {
        like: true,
        postId: "1",
        userId: "1",
      };
      const likeModel: PostLike = {
        id: '1',
        post: null,
        user: null,
        liked: false,
      };
      jest
        .spyOn(service, 'like')
        .mockImplementation((e) => Promise.resolve(likeModel));

      const result = await controller.like(postId, userId, like);

      expect(service.like).toHaveBeenCalledWith(dto);
      expect(result).toEqual(likeModel);
    });

    it('should throw BadRequestException when like fails', async () => {
      const postId = '1';
      const userId = '1';
      const like = true;

      jest.spyOn(service, 'like').mockImplementation(() => {
        throw new BadRequestException();
      });

      await expect(controller.like(postId, userId, like)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException when like fails', async () => {
      const postId = '1';
      const userId = '1';
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
