import { AuthService } from './auth.service';
import { Wallet } from 'ethers';
import { apiPort, jwtSecret, moralisAuthApiUrl } from '../../config/env';
import { verify, JwtPayload } from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { ChallengeResponseDto } from './dto/challengeResponse.dto';
import { ProtectedUserDto } from '../user/dto/protectedUser.dto';
import { UserDto } from '../user/dto/user.dto';
import { CompleteChallengeResponseDto } from './dto/completeChallengeResponse.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { appConfig } from '../../config/app';

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
      password: 'helloworld',
      address: '',
    };
    userService.createUser(web2User);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('can sign up with local', () => {
    const newWeb2User = {
      username: 'bbb@moralis.io',
      password: 'helloworld',
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
        password: 'helloworld',
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
      password: 'helloworld',
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
    const challengeResponse: ChallengeResponseDto = {
      id: '123',
      profileId: '',
      message: 'this is a signing message',
    };
    const signingData = authService.prepareSigningData(challengeResponse);

    expect(signingData.message).toEqual(challengeResponse.message);
    expect(signingData.signUrl).toEqual(
      `http://localhost:${apiPort}/auth/completeWithEthereum`,
    );
  });

  it('should create token', () => {
    const protectedUser: ProtectedUserDto = {
      profileId: '',
      address: wallet.address,
      username: 'email@moralis.io',
    };
    const completeChallengeResponse: CompleteChallengeResponseDto = {
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
