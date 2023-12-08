import { BadRequestException, Injectable } from '@nestjs/common';
import { PostCreateSuccessDto, PostRequestDto } from './dto/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostCreateSuccess } from '../models/generated_api';
import { UserItem } from '../users/entities/user-item.entity';
import { LikeDislikeDto } from './dto/like_dislike.dto';
import { PostLike } from './entities/post_like.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(PostLike)
    private postLikeRepository: Repository<PostLike>,
    @InjectRepository(UserItem)
    private userItemRepository: Repository<UserItem>,
  ) {}

  async create(createPostDto: PostRequestDto): Promise<PostCreateSuccess> {
    const { userId, text, visibility } = createPostDto;

    // Find the user item by ID
    const user = await this.userItemRepository.findOne({ where: { userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Create a new post entity and map properties from the DTO
    const post = new Post();
    post.text = text;
    post.visibility = visibility;
    post.user = user; // Associate the post with the found user

    const result = await this.postRepository.save(post);
    return new PostCreateSuccessDto(result.id);
  }

  async findAll(userId: number) {
    // Find the user item by ID
    const user = await this.userItemRepository.findOne({
      where: { userId },
      relations: ['friends', 'following'],
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const friends = user.friends.map((e) => e.userId);
    const following = user.following.map((e) => e.userId);
    const uniqueIds = Array.from(new Set([...friends, ...following]));

    return this.postRepository
      .createQueryBuilder('post')
      .innerJoin('post.user', 'user')
      .where("user.userId IN (:...userIds) AND post.visibility = 'public'", {
        userIds: uniqueIds,
      })
      .orWhere('user.userId = :userId', { userId })
      .orderBy('post.postedOn', 'DESC')
      .select([
        'user.userId as userId',
        'post.text as text',
        'post.visibility as visibility',
      ])
      .getRawMany();
  }

  async like(likeDislikeDto: LikeDislikeDto): Promise<PostLike> {
    const { userId, postId, like } = likeDislikeDto;
    const user = await this.userItemRepository.findOne({ where: { userId } });
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!user || !post) {
      throw new BadRequestException('User or post not found');
    }

    let postLike = await this.postLikeRepository.findOne({
      where: { user: user, post: post },
    });
    if (postLike) {
      postLike.liked = like;
    } else {
      postLike = this.postLikeRepository.create({
        user: user,
        post: post,
        liked: like,
      });
    }

    return this.postLikeRepository.save(postLike);
  }
}
