import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { WallsController } from './walls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserItem } from '../users/entities/user-item.entity';
import { Post } from './entities/post.entity';
import { PostLike } from './entities/post_like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserItem, Post, PostLike])],
  controllers: [PostsController, WallsController],
  providers: [PostsService],
})
export class PostsModule {}
