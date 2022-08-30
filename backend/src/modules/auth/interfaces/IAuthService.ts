import { EBlockchainType } from '../../../config/types';
import { ProtectedUserDto } from '../../../modules/user/dto/protectedUser.dto';
import { UserDto } from '../../../modules/user/dto/user.dto';
import { AuthWithLocalRequestDto } from '../dto/authWithLocalRequest.dto';
import { AuthWithLocalResponseDto } from '../dto/authWithLocalResponse.dto';
import { IChallengeResponse } from './IChallengeResponse';
import { ICompleteChallengeRequest } from './ICompleteChallengeRequest';
import { ICompleteChallengeResponse } from './ICompleteChallengeResponse';
import { ISignData } from './ISignData';
import { ITokenResponse } from './ITokenResponse';
import { IWeb3AuthRequest } from './IWeb3AuthRequest';

export interface IAuthService {
  signUp(authLocalRequest: AuthWithLocalRequestDto): AuthWithLocalResponseDto;
  signIn(authLocalRequest: AuthWithLocalRequestDto): AuthWithLocalResponseDto;
  signUpWithWeb3Auth(
    authRequest: IWeb3AuthRequest,
    blockchainType: EBlockchainType,
  ): Promise<ISignData>;
  signInWithWeb3Auth(
    authRequest: IWeb3AuthRequest,
    blockchainType: EBlockchainType,
  ): Promise<ISignData>;
  linkWithWeb3Auth(
    authRequest: IWeb3AuthRequest,
    blockchainType: EBlockchainType,
    user: UserDto,
  ): Promise<ISignData>;
  completeWithWeb3Auth(
    completeWithMoralisRequest: ICompleteChallengeRequest,
    blockchainType: EBlockchainType,
  ): Promise<ITokenResponse>;
  completeWithMoralisAuth(
    completeWithMoralisRequest: ICompleteChallengeRequest,
    blockchainType: EBlockchainType,
  ): Promise<ICompleteChallengeResponse>;
  signWithMoralisAuth(
    authRequest: IWeb3AuthRequest,
    blockchainType: EBlockchainType,
  ): Promise<IChallengeResponse>;
  prepareSignData(
    challengeResponse: IChallengeResponse,
    blockchainType: EBlockchainType,
  ): ISignData;
  createToken(
    completeChallengeResponse: ICompleteChallengeResponse,
    protectedUser: ProtectedUserDto,
  ): string;
}
