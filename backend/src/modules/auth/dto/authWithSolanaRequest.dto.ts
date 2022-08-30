import { PickType } from '@nestjs/swagger';
import { SolanaChallengeRequestDto } from './solana/solanaChallengeRequest.dto';

export class AuthWithSolanaRequestDto extends PickType(
  SolanaChallengeRequestDto,
  ['network', 'address'],
) {}
