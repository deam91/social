import {IsNotEmpty, IsOptional, IsString} from 'class-validator';

export class UserRequestDto {
    @IsString()
    @IsNotEmpty()
    fullName: string; // The user's name, assumed to be a string
}
