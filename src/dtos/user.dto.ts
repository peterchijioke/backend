

import { IsString, MinLength, IsNotEmpty, IsEmail } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username!: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Username cannot be empty' })
  username?: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;
}


export class LoginUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;
}
