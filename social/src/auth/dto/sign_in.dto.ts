import { IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  username: string; // assuming userId is a number

  @IsString()
  password: string; // assuming text is a string
}
