import { ApiProperty } from '@nestjs/swagger';
import {
  IsAscii,
  IsEthereumAddress,
  IsNumber,
  IsPositive,
  IsUrl,
  IsOptional,
  IsISO8601,
  Min,
  Max,
  IsArray,
} from 'class-validator';

export class ChallengeRequestDto {
  @ApiProperty({
    type: 'string',
    required: true,
    description: 'RFC 4501 dns authority that is requesting the signing.',
    example: 'defi.finance',
    format: 'hostname',
  })
  @IsUrl({ require_protocol: false, require_tld: false })
  domain: string;

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
    example: 'https://defi.finance/',
    description:
      'RFC 3986 URI referring to the resource that is the subject of the signing (as in the __subject__ of a claim).',
  })
  @IsUrl({ require_protocol: true, require_tld: false })
  uri: string;

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
    type: Number,
    required: true,
    minimum: 15,
    default: 15,
    maximum: 120,
    example: 15,
    description: 'Time in seconds before the challenge is expired',
  })
  @IsPositive()
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 })
  @Min(15)
  @Max(120)
  timeout: number;
}
