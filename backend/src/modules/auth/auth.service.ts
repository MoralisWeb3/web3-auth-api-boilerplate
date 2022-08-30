import axios from 'axios';
import { AuthWithLocalResponseDto } from './dto/authWithLocalResponse.dto';
import { AuthWithLocalRequestDto } from './dto/authWithLocalRequest.dto';
import { apiPort, moralisAuthApiUrl, xApiKey } from '../../config/env';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import {
  CACHE_MANAGER,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserDto } from '../user/dto/user.dto';
import { Cache } from 'cache-manager';
import { ProtectedUserDto } from '../user/dto/protectedUser.dto';
import { ETIMEOUT } from '../../config/timeout';
import { EHeaderKey, EBlockchainType } from '../../config/types';
import { IAuthService } from './interfaces/IAuthService';
import { ICompleteChallengeResponse } from './interfaces/ICompleteChallengeResponse';
import { IChallengeResponse } from './interfaces/IChallengeResponse';
import { ITokenResponse } from './interfaces/ITokenResponse';
import { IChallengeRequest } from './interfaces/IChallengeRequest';
import { ISignData } from './interfaces/ISignData';
import { ICompleteChallengeRequest } from './interfaces/ICompleteChallengeRequest';
import { IWeb3AuthRequest } from './interfaces/IWeb3AuthRequest';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  signUp(authLocalRequest: AuthWithLocalRequestDto): AuthWithLocalResponseDto {
    const user = this.userService.createUser({
      profileId: '',
      username: authLocalRequest.username,
      password: authLocalRequest.password,
      address: '',
    });

    const token = this.createToken(
      {
        id: '',
        chainId: 0,
        version: '',
        resources: [],
        address: user.address,
        nonce: '',
        uri: '',
        domain: moralisAuthApiUrl,
        profileId: user.profileId,
      },
      user,
    );

    return { token };
  }

  signIn(authLocalRequest: AuthWithLocalRequestDto): AuthWithLocalResponseDto {
    const user = this.userService.findUserByLocal(
      authLocalRequest.username,
      authLocalRequest.password,
    );

    if (!user) throw new UnauthorizedException('Unable to authenticate user');

    const token = this.createToken(
      {
        id: '',
        chainId: 0,
        version: '',
        resources: [],
        address: user.address,
        nonce: '',
        uri: '',
        domain: moralisAuthApiUrl,
        profileId: user.profileId,
      },
      user,
    );

    return { token };
  }

  async signUpWithWeb3Auth(
    authRequest: IWeb3AuthRequest,
    blockchainType: EBlockchainType,
  ): Promise<ISignData> {
    const addressOwner = this.userService.findUserByWeb3Auth(
      authRequest.address,
    );

    if (addressOwner)
      throw new ForbiddenException('Address has been registered');

    const challengeResponse = await this.signWithMoralisAuth(
      authRequest,
      blockchainType,
    );

    await this.cacheManager.set<ProtectedUserDto>(
      challengeResponse.id,
      {
        profileId: challengeResponse.profileId,
        username: '',
        address: authRequest.address,
      },
      { ttl: ETIMEOUT.AUTHENTICATION_LIFECYCLE },
    );

    return this.prepareSignData(challengeResponse, blockchainType);
  }

  async signInWithWeb3Auth(
    authRequest: IWeb3AuthRequest,
    blockchainType: EBlockchainType,
  ): Promise<ISignData> {
    const user = this.userService.findUserByWeb3Auth(authRequest.address);
    if (!user) throw new NotFoundException('Unable to authenticate user');

    const challengeResponse = await this.signWithMoralisAuth(
      authRequest,
      blockchainType,
    );

    await this.cacheManager.set<ProtectedUserDto>(challengeResponse.id, user, {
      ttl: ETIMEOUT.AUTHENTICATION_LIFECYCLE,
    });

    return this.prepareSignData(challengeResponse, blockchainType);
  }

  async linkWithWeb3Auth(
    authRequest: IWeb3AuthRequest,
    blockchainType: EBlockchainType,
    user: UserDto,
  ): Promise<ISignData> {
    const addressOwner = this.userService.findUserByWeb3Auth(
      authRequest.address,
    );

    if (addressOwner)
      throw new ForbiddenException('Address has been registered');

    const challengeResponse = await this.signWithMoralisAuth(
      authRequest,
      blockchainType,
    );

    await this.cacheManager.set<ProtectedUserDto>(
      challengeResponse.id,
      {
        profileId: challengeResponse.profileId,
        username: user.username,
        address: authRequest.address,
      },
      { ttl: ETIMEOUT.AUTHENTICATION_LIFECYCLE },
    );

    return this.prepareSignData(challengeResponse, blockchainType);
  }

  async completeWithWeb3Auth(
    completeChallengeRequest: ICompleteChallengeRequest,
    blockchainType: EBlockchainType,
  ): Promise<ITokenResponse> {
    const challengeResponse = await this.completeWithMoralisAuth(
      completeChallengeRequest,
      blockchainType,
    );

    const protectedUser = await this.cacheManager.get<ProtectedUserDto>(
      challengeResponse.id,
    );

    if (!protectedUser || !protectedUser.address)
      throw new NotFoundException('Unable to identify user');

    if (protectedUser.username) {
      this.userService.updateUserByUsername(
        protectedUser,
        protectedUser.username,
      );
    } else {
      const addressOwner = this.userService.findUserByWeb3Auth(
        protectedUser.address,
      );
      if (!addressOwner) {
        this.userService.createUser({
          profileId: challengeResponse.profileId,
          username: '',
          password: '',
          address: protectedUser.address,
        });
      }
    }

    const token = this.createToken(challengeResponse, protectedUser);

    return { token };
  }

  async completeWithMoralisAuth(
    completeChallengeRequest: ICompleteChallengeRequest,
    blockchainType: EBlockchainType,
  ): Promise<ICompleteChallengeResponse> {
    const { data } = await axios.post<ICompleteChallengeResponse>(
      `${moralisAuthApiUrl}/challenge/verify/${blockchainType}`,
      completeChallengeRequest,
      {
        headers: {
          [EHeaderKey.X_API_KEY]: xApiKey,
        },
      },
    );

    return data;
  }

  async signWithMoralisAuth(
    authRequest: IWeb3AuthRequest,
    blockchainType: EBlockchainType,
  ): Promise<IChallengeResponse> {
    const challengeRequest: IChallengeRequest = {
      address: authRequest.address,
      network: authRequest.network,
      chainId: authRequest.chainId,
      domain: 'localhost',
      timeout: ETIMEOUT.AUTHENTICATION_LIFECYCLE,
      uri: `${moralisAuthApiUrl}/auth`,
      expirationTime: new Date(
        new Date().getTime() + ETIMEOUT.AUTHENTICATED_USER,
      ).toISOString(),
      statement: 'I am a third party API',
      resources: [`${moralisAuthApiUrl}/auth`],
    };

    const { data } = await axios.post<IChallengeResponse>(
      `${moralisAuthApiUrl}/challenge/request/${blockchainType}`,
      challengeRequest,
      {
        headers: {
          [EHeaderKey.X_API_KEY]: xApiKey,
        },
      },
    );

    return data;
  }

  prepareSignData(
    challengeResponse: IChallengeResponse,
    blockchainType: EBlockchainType,
  ): ISignData {
    const pathMappings = {
      [EBlockchainType.EVM]: 'complete/evm',
      [EBlockchainType.SOLANA]: 'complete/solana',
    };
    const path = pathMappings[blockchainType];
    const signInResponse = {
      message: challengeResponse.message,
      signUrl: `http://localhost:${apiPort}/auth/${path}`,
    };

    return signInResponse as any as ISignData;
  }

  createToken(
    completeChallengeResponse: ICompleteChallengeResponse,
    protectedUser: ProtectedUserDto,
  ): string {
    const { version, resources, address, nonce, uri, domain, profileId } =
      completeChallengeResponse;

    const jwtClaims = {
      version: version,
      resources: resources,
      address: address,
      profileId: profileId,
      ...protectedUser,
    };

    const signOptions: JwtSignOptions = {
      issuer: address,
      jwtid: nonce,
      subject: uri,
      audience: domain,
      expiresIn: ETIMEOUT.AUTHENTICATED_USER,
    };

    return this.jwtService.sign(jwtClaims, signOptions);
  }
}
