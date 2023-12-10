import { SetMetadata } from '@nestjs/common';

export const jwtConstants = {
  secret: 'topSecret-secretKey',
};

export const saltOrRounds = 10;

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
