import { ApiProperty } from '@nestjs/swagger';

export class ChallengeResponseDto {
  @ApiProperty({
    type: String,
    required: true,
    maxLength: 64,
    minLength: 8,
    description:
      'Secret Challenge ID used to identify this particular request. Is should be used at the backend of the calling service to identify the completed request.',
    example: 'fRyt67D3eRss3RrX',
    pattern: '^[a-zA-Z0-9]{8,64}$',
  })
  id: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Message that needs to be signed by the end user',
    example:
      'defi.finance wants you to sign in with your Ethereum account:\n0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B\n\nPlease confirm\n\nURI: https://defi.finance/\nVersion: 1\nChain ID: 1\nNonce: DbU1DCTmdzR4lg3wi\nIssued At: 2022-06-12T12:15:31.290Z\nExpiration Time: 2020-01-01T00:00:00.000Z\nNot Before: 2020-01-01T00:00:00.000Z\nResources:\n- https://docs.moralis.io/',
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
