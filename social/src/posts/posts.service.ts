import { BadRequestException, Injectable } from '@nestjs/common';
import { PostCreateSuccessDto, PostRequestDto } from './dto/create-post.dto';
import { Repository } from 'typeorm';
import { Post, PostVisibility } from './entities/post.entity';
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
    post.visibility =
      visibility === PostVisibility.PUBLIC
        ? PostVisibility.PUBLIC
        : PostVisibility.PRIVATE;
    post.user = user; // Associate the post with the found user

    const result = await this.postRepository.save(post);
    return new PostCreateSuccessDto(result.id);
  }

  async findAll(username: string, authUser: any) {
    let query = this.postRepository
      .createQueryBuilder('post')
      .innerJoin('post.user', 'user');
    // If I am authenticated
    if (authUser) {
      // If /walls get my own wall
      if (!username || username == '') {
        const me = await this.userItemRepository.findOne({
          where: { userId: authUser.sub },
          relations: ['friends', 'following'],
        });
        if (!me) {
          throw new BadRequestException('User not found');
        }
        query = query.where('user.username = :me', { me: me.username });
        const friends = me.friends.map((e) => e.userId);
        const following = me.following.map((e) => e.userId);
        const uniqueIds = Array.from(new Set([...friends, ...following]));
        query = query.orWhere(
          "user.userId IN (:...userIds) AND post.visibility = 'public'",
          {
            userIds: uniqueIds,
          },
        );
      }
      // If /walls/charles get charles public posts
      else {
        const user = await this.userItemRepository.findOne({
          where: { username },
          relations: ['friends', 'following'],
        });
        if (!user) {
          throw new BadRequestException('User not found');
        }
        //
        query = query
          .where('user.username = :username', { username })
          .where("post.visibility = 'public'");
      }
    } else if (username && username != '') {
      query = query
        .where('user.username = :username', { username })
        .where("post.visibility = 'public'");
    } else
      throw new BadRequestException('You must specify a username parameter');

    return query
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
