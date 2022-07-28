import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsPositive, Min } from 'class-validator';

export class AuthWithEthereumRequestDto {
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
}
