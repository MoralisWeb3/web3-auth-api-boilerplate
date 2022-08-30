import { PickType } from '@nestjs/swagger';
import { EvmChallengeRequestDto } from './evm/evmChallengeRequest.dto';

export class AuthWithEvmRequestDto extends PickType(EvmChallengeRequestDto, [
  'chainId',
  'address',
]) {}
