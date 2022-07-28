import axios from 'axios';
import { ChallengeRequestDto } from './dto/challengeRequest.dto';
import { CompleteWithEthereumRequestDto } from './dto/completeWithEthereumRequest.dto';
import { CompleteWithEthereumResponseDto } from './dto/completeWithEthereumResponse.dto';
import { AuthWithEthereumRequestDto } from './dto/authWithEthereumRequest.dto';
import { AuthWithEthereumResponseDto } from './dto/authWithEthereumResponse.dto';
import { AuthLocalResponseDto } from './dto/authLocalResponse.dto';
import { AuthLocalRequestDto } from './dto/authLocalRequest.dto';
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
import { ChallengeResponseDto } from './dto/challengeResponse.dto';
import { Cache } from 'cache-manager';
import { ProtectedUserDto } from '../user/dto/protectedUser.dto';
import { ETIMEOUT } from '../../config/timeout';
import { CompleteChallengeResponseDto } from './dto/completeChallengeResponse.dto';
import { EHeaderKey } from '../../config/types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  signUp(authLocalRequest: AuthLocalRequestDto): AuthLocalResponseDto {
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

  signIn(authLocalRequest: AuthLocalRequestDto): AuthLocalResponseDto {
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

  async signUpWithEthereum(
    authWithEthereumRequest: AuthWithEthereumRequestDto,
  ): Promise<AuthWithEthereumResponseDto> {
    const addressOwner = this.userService.findUserByWeb3Auth(
      authWithEthereumRequest.address,
    );

    if (addressOwner)
      throw new ForbiddenException('Address has been registered');

    const challengeResponse = await this.signWithMoralisAuth(
      authWithEthereumRequest,
    );

    await this.cacheManager.set<ProtectedUserDto>(
      challengeResponse.id,
      {
        profileId: challengeResponse.profileId,
        username: '',
        address: authWithEthereumRequest.address,
      },
      { ttl: ETIMEOUT.AUTHENTICATION_LIFECYCLE },
    );

    return this.prepareSigningData(challengeResponse);
  }

  async signInWithEthereum(
    authWithEthereumRequest: AuthWithEthereumRequestDto,
  ): Promise<AuthWithEthereumResponseDto> {
    const user = this.userService.findUserByWeb3Auth(
      authWithEthereumRequest.address,
    );
    if (!user) throw new NotFoundException('Unable to authenticate user');

    const challengeResponse = await this.signWithMoralisAuth(
      authWithEthereumRequest,
    );

    await this.cacheManager.set<ProtectedUserDto>(challengeResponse.id, user, {
      ttl: ETIMEOUT.AUTHENTICATION_LIFECYCLE,
    });

    return this.prepareSigningData(challengeResponse);
  }

  async linkWithEthereum(
    authWithEthereumRequest: AuthWithEthereumRequestDto,
    user: UserDto,
  ): Promise<AuthWithEthereumResponseDto> {
    const addressOwner = this.userService.findUserByWeb3Auth(
      authWithEthereumRequest.address,
    );

    if (addressOwner)
      throw new ForbiddenException('Address has been registered');

    const challengeResponse = await this.signWithMoralisAuth(
      authWithEthereumRequest,
    );

    await this.cacheManager.set<ProtectedUserDto>(
      challengeResponse.id,
      {
        profileId: challengeResponse.profileId,
        username: user.username,
        address: authWithEthereumRequest.address,
      },
      { ttl: ETIMEOUT.AUTHENTICATION_LIFECYCLE },
    );

    return this.prepareSigningData(challengeResponse);
  }

  async completeWithEthereum(
    completeWithEthereumRequest: CompleteWithEthereumRequestDto,
  ): Promise<CompleteWithEthereumResponseDto> {
    const challengeResponse = await this.completeWithMoralisAuth(
      completeWithEthereumRequest,
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
    completeWithEthereumRequest: CompleteWithEthereumRequestDto,
  ): Promise<CompleteChallengeResponseDto> {
    const { data } = await axios.post<CompleteChallengeResponseDto>(
      `${moralisAuthApiUrl}/challenge/verify/evm`,
      completeWithEthereumRequest,
      {
        headers: {
          [EHeaderKey.X_API_KEY]: xApiKey,
        },
      },
    );

    return data;
  }

  async signWithMoralisAuth(
    authWithEthereumRequest: AuthWithEthereumRequestDto,
  ): Promise<ChallengeResponseDto> {
    const challengeRequest: ChallengeRequestDto = {
      address: authWithEthereumRequest.address,
      chainId: authWithEthereumRequest.chainId,
      domain: 'localhost',
      timeout: ETIMEOUT.AUTHENTICATION_LIFECYCLE,
      uri: `${moralisAuthApiUrl}/auth`,
      expirationTime: new Date(
        new Date().getTime() + ETIMEOUT.AUTHENTICATED_USER,
      ).toISOString(),
      statement: 'I am a third party API',
      resources: [`${moralisAuthApiUrl}/auth`],
    };

    const { data } = await axios.post<ChallengeResponseDto>(
      `${moralisAuthApiUrl}/challenge/request/evm`,
      challengeRequest,
      {
        headers: {
          [EHeaderKey.X_API_KEY]: xApiKey,
        },
      },
    );

    return data;
  }

  prepareSigningData(challengeResponse: ChallengeResponseDto) {
    const signInResponse: AuthWithEthereumResponseDto = {
      message: challengeResponse.message,
      signUrl: `http://localhost:${apiPort}/auth/completeWithEthereum`,
    };

    return signInResponse;
  }

  createToken(
    completeChallengeResponse: CompleteChallengeResponseDto,
    protectedUser: ProtectedUserDto,
  ) {
    const {
      chainId,
      version,
      resources,
      address,
      nonce,
      uri,
      domain,
      profileId,
    } = completeChallengeResponse;

    const jwtClaims = {
      chainId: chainId,
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
