import { EvmCompleteChallengeRequestDto } from './evmCompleteChallengeRequest.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

describe('completeChallengeRequest', () => {
  it('creates with valid signature structure', async () => {
    const completeChallengeRequest: EvmCompleteChallengeRequestDto =
      plainToClass(EvmCompleteChallengeRequestDto, {
        signature: '0xAbC123',
        message: 'This is a simple message',
      });
    const result = await validate(completeChallengeRequest);
    expect(result).toHaveLength(0);
  });
  it('throws if no signature is present', async () => {
    const completeChallengeRequest: EvmCompleteChallengeRequestDto =
      plainToClass(EvmCompleteChallengeRequestDto, {
        signature: '',
        message: 'This is a simple message',
      });
    const errors = await validate(completeChallengeRequest);
    expect(JSON.stringify(errors)).toContain('signature must be present');
  });

  it('throws an invalid signature structure is present', async () => {
    const completeChallengeRequest: EvmCompleteChallengeRequestDto =
      plainToClass(EvmCompleteChallengeRequestDto, {
        signature: 'turov',
        message: 'This is a simple message',
      });
    const errors = await validate(completeChallengeRequest);
    expect(JSON.stringify(errors)).toContain(
      'signature must be a valid hex string',
    );
  });
});
