import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsAscii,
  IsNumber,
  IsPositive,
  IsUrl,
  IsOptional,
  IsISO8601,
  Min,
  Max,
  IsArray,
  Length,
  IsEnum,
} from 'class-validator';
import { ESolanaNetwork } from '../../types/ESolanaNetwork';

export class SolanaChallengeRequestDto {
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
    enum: ESolanaNetwork,
    required: true,
    example: ESolanaNetwork.MAINNET,
    description: 'The network where Contract Accounts must be resolved.',
  })
  @IsEnum(ESolanaNetwork)
  @IsNotEmpty()
  network: ESolanaNetwork;

  @ApiProperty({
    type: String,
    required: true,
    example: '26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo',
    description:
      'Solana public key with a length of 44 characters that is used to perform the signing',
  })
  @Length(44)
  @IsNotEmpty()
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
  @IsUrl({ require_protocol: true, require_tld: false }, { each: true })
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
