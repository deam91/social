import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserItem } from '../users/entities/user-item.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        JwtService,
        {
          provide: getRepositoryToken(UserItem),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sign in a user', async () => {
    const username = 'user';
    const password = 'password';
    const user = {
      userId: 1,
      username,
      password: 'password',
      fullName: 'user 1',
    } as unknown as UserItem;
    const findOneSpy = jest
      .spyOn(usersService, 'findOne')
      .mockResolvedValue(Promise.resolve(user));
    const compareSpy = jest
      .spyOn(bcrypt, 'compare')
      .mockImplementation(() => Promise.resolve(true));
    const signAsyncSpy = jest
      .spyOn(jwtService, 'signAsync')
      .mockResolvedValue('accessToken');

    const result = await service.signIn(username, password);

    expect(findOneSpy).toHaveBeenCalledWith(username);
    expect(compareSpy).toHaveBeenCalledWith(password, user.password);
    expect(signAsyncSpy).toHaveBeenCalledWith({
      sub: user.userId,
      username: user.username,
    });
    expect(result).toEqual({ access_token: 'accessToken' });
  });
});
