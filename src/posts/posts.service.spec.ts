import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { PostLike } from './entities/post_like.entity';
import { UserItem } from '../users/entities/user-item.entity';
import { PostCreateSuccessDto, PostRequestDto } from './dto/create-post.dto';
import { LikeDislikeDto } from './dto/like_dislike.dto';

describe('PostsService', () => {
  let service: PostsService;
  let postRepository: Repository<Post>;
  let postLikeRepository: Repository<PostLike>;
  let userItemRepository: Repository<UserItem>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postRepository = module.get<Repository<Post>>(getRepositoryToken(Post));
    postLikeRepository = module.get<Repository<PostLike>>(
      getRepositoryToken(PostLike),
    );
    userItemRepository = module.get<Repository<UserItem>>(
      getRepositoryToken(UserItem),
    );
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const createPostDto: PostRequestDto = {
        userId: 1,
        text: 'Test post',
        visibility: 'public',
      };

      const userItem = new UserItem();
      userItem.userId = createPostDto.userId;
      jest.spyOn(userItemRepository, 'findOne').mockResolvedValue(userItem);

      const post = new Post();
      post.text = createPostDto.text;
      post.visibility = createPostDto.visibility;
      post.user = userItem;
      jest.spyOn(postRepository, 'save').mockResolvedValue(post);

      const result = await service.create(createPostDto);

      expect(userItemRepository.findOne).toHaveBeenCalledWith({
        where: { userId: createPostDto.userId },
      });
      expect(postRepository.save).toHaveBeenCalledWith(post);
      expect(result).toBeInstanceOf(PostCreateSuccessDto);
      expect(result.postId).toBe(post.id);
    });

    it('should throw BadRequestException if user is not found', async () => {
      const createPostDto: PostRequestDto = {
        userId: 1,
        text: 'Test post',
        visibility: 'public',
      };

      jest.spyOn(userItemRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.create(createPostDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should find all posts for a user', async () => {
      const userId = 1;

      const userItem = new UserItem();
      userItem.userId = userId;
      userItem.friends = [];
      userItem.following = [];
      jest.spyOn(userItemRepository, 'findOne').mockResolvedValue(userItem);

      const posts = [
        { userId: 2, text: 'Post 1', visibility: 'public' },
        { userId: 3, text: 'Post 2', visibility: 'public' },
      ];
      jest.spyOn(postRepository, 'createQueryBuilder').mockReturnValue({
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(posts),
      } as unknown as SelectQueryBuilder<Post>);

      const result = await service.findAll(userId);

      expect(userItemRepository.findOne).toHaveBeenCalledWith({
        where: { userId },
        relations: ['friends', 'following'],
      });
      expect(postRepository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(posts);
    });

    it('should throw BadRequestException if user is not found', async () => {
      const userId = 1;

      jest.spyOn(userItemRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.findAll(userId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('like', () => {
    it('should like a post', async () => {
      const likeDislikeDto: LikeDislikeDto = {
        userId: 1,
        postId: 1,
        like: true,
      };

      const userItem = new UserItem();
      userItem.userId = likeDislikeDto.userId;
      jest.spyOn(userItemRepository, 'findOne').mockResolvedValue(userItem);

      const post = new Post();
      post.id = likeDislikeDto.postId;
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(post);

      const postLike = new PostLike();
      postLike.user = userItem;
      postLike.post = post;
      jest.spyOn(postLikeRepository, 'findOne').mockResolvedValue(postLike);
      jest.spyOn(postLikeRepository, 'create').mockReturnValue(postLike);
      jest.spyOn(postLikeRepository, 'save').mockResolvedValue(postLike);

      const result = await service.like(likeDislikeDto);

      expect(userItemRepository.findOne).toHaveBeenCalledWith({
        where: { userId: likeDislikeDto.userId },
      });
      expect(postRepository.findOne).toHaveBeenCalledWith({
        where: { id: likeDislikeDto.postId },
      });
      expect(postLikeRepository.findOne).toHaveBeenCalledWith({
        where: { user: userItem, post },
      });
      expect(postLikeRepository.create).toHaveBeenCalledWith({
        user: userItem,
        post,
        liked: likeDislikeDto.like,
      });
      expect(postLikeRepository.save).toHaveBeenCalledWith(postLike);
      expect(result).toBe(postLike);
    });

    it('should throw BadRequestException if user or post is not found', async () => {
      const likeDislikeDto: LikeDislikeDto = {
        userId: 1,
        postId: 1,
        like: true,
      };

      jest.spyOn(userItemRepository, 'findOne').mockResolvedValue(undefined);
      jest.spyOn(postRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.like(likeDislikeDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
