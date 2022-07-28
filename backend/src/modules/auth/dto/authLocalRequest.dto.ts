import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthLocalRequestDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'johndoe',
    description: 'Username of the user.',
  })
  @IsNotEmpty()
  @IsEmail()
  username: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'john3657doe',
    description: 'Password of the user.',
  })
  @IsNotEmpty()
  password: string;
}
