import { IntersectionType, PickType } from '@nestjs/swagger';
import { SignUrlDto } from './common/signUrl.dto';
import { EvmChallengeResponseDto } from './evm/evmChallengeResponse.dto';

export class AuthWithEvmResponseDto extends PickType(
  IntersectionType(EvmChallengeResponseDto, SignUrlDto),
  ['message', 'signUrl'],
) {}
