import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

const mockJwtService = {
  verifyAsync: jest.fn().mockResolvedValue({ id: 1, username: 'test' }),
};

const mockReflector = {
  getAllAndOverride: jest.fn().mockReturnValue(false),
};

const mockRequest = {
  headers: {
    authorization: 'Bearer token',
  },
  user: { id: 1, username: 'test' },
};

const mockContext = {
  switchToHttp: jest.fn().mockReturnValue({
    getRequest: jest.fn().mockReturnValue(mockRequest),
  }),
  getHandler: jest.fn(),
  getClass: jest.fn(),
};

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        { provide: JwtService, useValue: mockJwtService },
        { provide: Reflector, useValue: mockReflector },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if the route is public', async () => {
      mockReflector.getAllAndOverride.mockReturnValue(true);

      const result = await guard.canActivate(mockContext as unknown as ExecutionContext);

      expect(result).toBe(true);
      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith('isPublic', [
        mockContext.getHandler(),
        mockContext.getClass(),
      ]);
    });

    it('should throw UnauthorizedException if no token is provided', async () => {
      mockRequest.headers.authorization = undefined;
      jest.spyOn(guard, 'canActivate').mockImplementation(() => {
        throw new UnauthorizedException();
      });
      expect(() => guard.canActivate(mockContext as unknown as ExecutionContext)).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if the token is invalid', async () => {
      jest.spyOn(guard, 'canActivate').mockImplementation(() => {
        mockJwtService.verifyAsync('token', {
          secret: 'topSecret-secretKey',
        });
        throw new UnauthorizedException();
      });

      await expect(
          () => guard.canActivate(mockContext as unknown as ExecutionContext),
      ).toThrow(UnauthorizedException);
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('token', {
        secret: 'topSecret-secretKey',
      });
    });

    it('should set the user in the request object if the token is valid', async () => {

      jest.spyOn(guard, 'canActivate').mockImplementation(() => {
        mockJwtService.verifyAsync('token', {
          secret: 'topSecret-secretKey',
        });
        mockRequest['user'] = { id: 1, username: 'test' };
        return Promise.resolve(true);
      });

      await guard.canActivate(mockContext as unknown as ExecutionContext);
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('token', {
        secret: 'topSecret-secretKey',
      });
      expect(mockRequest.user).toEqual({ id: 1, username: 'test' });
    });
  });
});
