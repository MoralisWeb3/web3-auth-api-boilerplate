import { IntersectionType, PickType } from '@nestjs/swagger';
import { SignUrlDto } from './common/signUrl.dto';
import { SolanaChallengeResponseDto } from './solana/solanaChallengeResponse.dto';

export class AuthWithSolanaResponseDto extends PickType(
  IntersectionType(SolanaChallengeResponseDto, SignUrlDto),
  ['message', 'signUrl'],
) {}
