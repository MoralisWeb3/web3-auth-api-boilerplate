import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthLocalResponseDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Authentication token for user to access data.',
  })
  @IsNotEmpty()
  token: string;
}
