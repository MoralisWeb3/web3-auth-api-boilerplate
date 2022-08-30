import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class SignUrlDto {
  @ApiProperty({
    type: String,
    required: true,
    format: 'uri',
    example: 'https://auth.moralis.io/challenge/complete',
    description: 'Moralis Signature Verification URL',
  })
  @IsUrl({ require_protocol: true })
  signUrl: string;
}
