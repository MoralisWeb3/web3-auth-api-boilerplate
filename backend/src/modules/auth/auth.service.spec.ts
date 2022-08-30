import { AuthService } from './auth.service';
import { Wallet } from 'ethers';
import { apiPort, jwtSecret, moralisAuthApiUrl } from '../../config/env';
import { verify, JwtPayload } from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { ProtectedUserDto } from '../user/dto/protectedUser.dto';
import { UserDto } from '../user/dto/user.dto';
import { EBlockchainType } from '../../config/types';
import { Test, TestingModule } from '@nestjs/testing';
import { appConfig } from '../../config/app';
import { EvmChallengeResponseDto } from './dto/evm/evmChallengeResponse.dto';
import { EvmCompleteChallengeResponseDto } from './dto/evm/evmCompleteChallengeResponse.dto';

describe('auth service', () => {
  let module: TestingModule;
  let wallet: Wallet;
  let userService: UserService;
  let authService: AuthService;
  let web2User: UserDto;

  beforeAll(async () => {
    module = await Test.createTestingModule(appConfig).compile();

    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);

    wallet = Wallet.createRandom();

    web2User = {
      profileId: '',
      username: 'aaa@moralis.io',
      password: 'moralispassword',
      address: '',
    };
    userService.createUser(web2User);
  });

  it('can sign up with local', () => {
    const newWeb2User = {
      username: 'bbb@moralis.io',
      password: 'moralispassword',
    };
    const authLocalResponse = authService.signUp(newWeb2User);

    expect(authLocalResponse.token).toBeTruthy();
    const token = authLocalResponse.token;

    const jwtPayload: JwtPayload = verify(token, jwtSecret) as JwtPayload;

    expect(jwtPayload['username']).toEqual(newWeb2User.username);
  });

  it('cannot sign up local with the same username', () => {
    let message = '';
    try {
      authService.signUp({
        username: 'aaa@moralis.io',
        password: 'moralispassword',
      });
    } catch (error: any) {
      message = error.message;
    }

    expect(message).toEqual('Identity already registered');
  });

  it('can sign in local', () => {
    const authLocalResponse = authService.signIn(web2User);

    expect(authLocalResponse.token).toBeTruthy();
    const token = authLocalResponse.token;

    const jwtPayload: JwtPayload = verify(token, jwtSecret) as JwtPayload;

    expect(jwtPayload['username']).toEqual(web2User.username);
  });

  it('cannot sign in local with wrong password', () => {
    let message = '';
    try {
      authService.signIn({
        username: web2User.username,
        password: web2User.password + '1',
      });
    } catch (error: any) {
      message = error.message;
    }

    expect(message).toEqual('Unable to authenticate user');
  });

  it('can sign in local and that is linked to web3 auth', () => {
    const user: UserDto = {
      profileId: '',
      username: 'email@moralis.io',
      password: 'moralispassword',
      address: wallet.address,
    };
    userService.createUser(user);

    const authLocalResponse = authService.signIn(user);

    expect(authLocalResponse.token).toBeTruthy();
    const token = authLocalResponse.token;

    const jwtPayload: JwtPayload = verify(token, jwtSecret) as JwtPayload;

    expect(jwtPayload['username']).toEqual(user.username);
  });

  it('should return sign message data', () => {
    const challengeResponse: EvmChallengeResponseDto = {
      id: '123',
      profileId: '',
      message: 'this is a signing message',
    };
    const signingData = authService.prepareSigningData(
      challengeResponse,
      EBlockchainType.EVM,
    );

    expect(signingData.message).toEqual(challengeResponse.message);
    expect(signingData.signUrl).toEqual(
      `http://localhost:${apiPort}/auth/complete/evm`,
    );
  });

  it('should create token', () => {
    const protectedUser: ProtectedUserDto = {
      profileId: '',
      address: wallet.address,
      username: 'email@moralis.io',
    };
    const completeChallengeResponse: EvmCompleteChallengeResponseDto = {
      id: '',
      chainId: 0,
      version: '',
      resources: [],
      address: '',
      nonce: '',
      uri: '',
      domain: `${moralisAuthApiUrl}`,
      profileId: '',
    };
    const token = authService.createToken(
      completeChallengeResponse,
      protectedUser,
    );

    expect(token).toBeTruthy();

    const jwtPayload: JwtPayload = verify(token, jwtSecret) as JwtPayload;

    expect(jwtPayload['username']).toEqual(protectedUser.username);
    expect(jwtPayload['address']).toEqual(protectedUser.address);
  });

  afterAll(async () => {
    await module.close();
  });
});
