import { ApiProperty } from '@nestjs/swagger';
import { IsAscii, IsNotEmpty } from 'class-validator';
import { IsValidHexString } from '../../../config/utils';

export class CompleteWithEthereumRequestDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Message that needs to be signed by the end user',
    example:
      'defi.finance wants you to sign in with your Ethereum account:\n0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B\n\nPlease confirm\n\nURI: https://defi.finance/\nVersion: 1\nChain ID: 1\nNonce: DbU1DCTmdzR4lg3wi\nIssued At: 2022-06-12T12:15:31.290Z\nExpiration Time: 2020-01-01T00:00:00.000Z\nNot Before: 2020-01-01T00:00:00.000Z\nResources:\n- https://docs.moralis.io/',
  })
  @IsAscii()
  @IsNotEmpty({ message: 'message must be present' })
  message: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '0x1234567890abcdef0123456789abcdef1234567890abcdef',
  })
  @IsNotEmpty({ message: 'signature must be present' })
  @IsValidHexString({ message: 'signature must be a valid hex string' })
  signature: string;
}
