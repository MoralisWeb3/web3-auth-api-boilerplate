import { ApiProperty } from '@nestjs/swagger';

export class SolanaChallengeResponseDto {
  @ApiProperty({
    type: String,
    required: true,
    maxLength: 64,
    minLength: 8,
    description:
      '17-characters Alphanumeric string Secret Challenge ID used to identify this particular request. Is should be used at the backend of the calling service to identify the completed request.',
    example: 'fRyt67D3eRss3RrX',
    pattern: '^[a-zA-Z0-9]{8,64}$',
  })
  id: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Message that needs to be signed by the end user',
    example:
      'defi.finance wants you to sign in with your Solana account:\n26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo\n\nI am a third party API\n\nURI: http://defi.finance\nVersion: 1\nNetwork: mainnet\nNonce: PYxxb9msdjVXsMQ9x\nIssued At: 2022-08-25T11:02:34.097Z\nExpiration Time: 2022-08-25T11:12:38.243Z\nResources:\n- https://docs.moralis.io/',
  })
  message: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Unique identifier with a length of 66 characters',
    example:
      '0xbfbcfab169c67072ff418133124480fea02175f1402aaa497daa4fd09026b0e1',
  })
  profileId: string;
}
