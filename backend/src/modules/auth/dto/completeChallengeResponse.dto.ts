import { ApiProperty } from '@nestjs/swagger';
import {
  IsEthereumAddress,
  IsPositive,
  IsUrl,
  IsOptional,
  Min,
  IsArray,
  IsNotEmpty,
  IsAscii,
  IsISO8601,
} from 'class-validator';

export class CompleteChallengeResponseDto {
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
    type: 'string',
    required: true,
    description: 'RFC 4501 dns authority that is requesting the signing.',
    example: 'rugpull.finance',
    format: 'hostname',
  })
  @IsUrl({ require_protocol: false })
  domain: string;

  @ApiProperty({
    type: Number,
    minimum: 0,
    required: true,
    example: 1,
    description:
      'EIP-155 Chain ID to which the session is bound, and the network where Contract Accounts must be resolved.',
  })
  @IsPositive()
  @Min(1)
  chainId: number;

  @ApiProperty({
    type: String,
    required: true,
    example: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    description:
      'Ethereum address performing the signing conformant to capitalization encoded checksum specified in EIP-55 where applicable.',
  })
  @IsEthereumAddress()
  address: string;

  @ApiProperty({
    type: String,
    required: false,
    description:
      'Human-readable ASCII assertion that the user will sign, and it must not contain `\n`.',
    example: 'Please confirm',
  })
  @IsOptional()
  @IsAscii()
  statement?: string;

  @ApiProperty({
    type: String,
    required: true,
    format: 'uri',
    example: 'https://rugpull.finance/',
    description:
      'RFC 3986 URI referring to the resource that is the subject of the signing (as in the __subject__ of a claim).',
  })
  @IsUrl({ require_protocol: true, require_tld: false })
  uri: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    required: false,
    example: '2020-01-01T00:00:00.000Z',
    description:
      'ISO 8601 datetime string that, if present, indicates when the signed authentication message is no longer valid.',
  })
  @IsOptional()
  @IsISO8601()
  expirationTime?: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    required: false,
    example: '2020-01-01T00:00:00.000Z',
    description:
      'ISO 8601 datetime string that, if present, indicates when the signed authentication message will become valid.',
  })
  @IsOptional()
  @IsISO8601()
  notBefore?: string;

  @ApiProperty({
    type: [String],
    required: false,
    example: ['https://docs.moralis.io/'],
    description:
      'List of information or references to information the user wishes to have resolved as part of authentication by the relying party. They are expressed as RFC 3986 URIs separated by `\n- `.',
  })
  @IsOptional()
  @IsArray()
  resources?: Array<string>;

  @ApiProperty({
    type: String,
    required: true,
    example: '1.0',
    description:
      'EIP-155 Chain ID to which the session is bound, and the network where Contract Accounts must be resolved.',
  })
  version: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '0x1234567890abcdef0123456789abcdef1234567890abcdef',
  })
  @IsNotEmpty()
  nonce: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Unique identifier with a length of 66 characters',
    example:
      '0xbfbcfab169c67072ff418133124480fea02175f1402aaa497daa4fd09026b0e1',
  })
  profileId: string;
}
