import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserItem } from '../users/entities/user-item.entity';
import { Repository } from 'typeorm';

const mockJwtService = {};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getRepositoryToken(UserItem),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should call authService.signIn with correct parameters', () => {
      const signInDto = { username: 'test', password: 'password' };
      const signInSpy = jest.spyOn(authService, 'signIn').mockImplementation();

      controller.signIn(signInDto);

      expect(signInSpy).toHaveBeenCalledWith(
        signInDto.username,
        signInDto.password,
      );
    });
  });

  describe('getProfile', () => {
    it('should return the user from the request object', () => {
      const user = { id: 1, username: 'test' };
      const req = { user };

      const result = controller.getProfile(req);

      expect(result).toBe(user);
    });
  });
});
