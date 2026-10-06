import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'student@codearena.dev or username' })
  @IsString({ message: 'Email or username is required' })
  email: string;

  @ApiProperty({ example: 'Student@123!' })
  @IsString({ message: 'Password is required' })
  password: string;
}
