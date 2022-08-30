import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SolanaCompleteChallengeRequestDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Message that needs to be signed by the end user',
    example:
      'defi.finance wants you to sign in with your Solana account:\n26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo\n\nI am a third party API\n\nURI: http://defi.finance\nVersion: 1\nNetwork: mainnet\nNonce: PYxxb9msdjVXsMQ9x\nIssued At: 2022-08-25T11:02:34.097Z\nExpiration Time: 2022-08-25T11:12:38.243Z\nResources:\n- https://docs.moralis.io/',
  })
  @IsNotEmpty({ message: 'message must be present' })
  message: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Base58 signature that needs to be used to verify end user',
    example:
      '2pH9DqD5rve2qV4yBDshcAjWd2y8TqMx8BPb7f3KoNnuLEhE5JwjruYi4jaFaD4HN6wriLz2Vdr32kRBAJmHcyny',
  })
  @IsNotEmpty({ message: 'signature must be present' })
  signature: string;
}
