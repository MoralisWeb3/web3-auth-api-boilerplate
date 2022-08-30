import { ApiProperty } from '@nestjs/swagger';
import { IsAscii, IsNotEmpty } from 'class-validator';
import { IsValidHexString } from '../../../../decorators/isValidHexString';

export class EvmCompleteChallengeRequestDto {
  @ApiProperty({ type: String, required: true })
  @IsAscii()
  @IsNotEmpty({ message: 'message must be present' })
  message: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '0x1234567890abcdef0123456789abcdef1234567890abcdef',
  })
  @IsNotEmpty({ message: 'signature must be present' })
  @IsValidHexString()
  signature: string;
}
