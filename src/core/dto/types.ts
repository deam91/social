import { IsString } from 'class-validator';

export class Type200 {
  constructor(message: string) {
    this.message = message;
  }

  @IsString()
  message: string;
}

export class Type400 {
  constructor(message: string) {
    this.message = message;
  }

  @IsString()
  message: string;
}

export class Type500 {
  constructor(message: string) {
    this.message = message;
  }

  @IsString()
  message: string;
}
