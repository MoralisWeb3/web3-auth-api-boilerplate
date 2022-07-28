import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class AuthWithEthereumResponseDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Message that needs to be signed by the end user',
    example:
      'rugpull.finance wants you to sign in with your Ethereum account:\n0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B\n\nPlease confirm\n\nURI: https://rugpull.finance/\nVersion: 1\nChain ID: 1\nNonce: DbU1DCTmdzR4lg3wi\nIssued At: 2022-06-12T12:15:31.290Z\nExpiration Time: 2020-01-01T00:00:00.000Z\nNot Before: 2020-01-01T00:00:00.000Z\nResources:\n- https://docs.moralis.io/',
  })
  message: string;

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
