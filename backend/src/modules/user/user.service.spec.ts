import { Test, TestingModule } from '@nestjs/testing';
import { createHash } from 'crypto';
import { Wallet } from 'ethers';
import { appConfig } from '../../config/app';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

describe('user service', () => {
  let module: TestingModule;
  let wallet1: Wallet;
  let wallet2: Wallet;
  let userService: UserService;
  let webUser: UserDto;

  beforeAll(async () => {
    module = await Test.createTestingModule(appConfig).compile();

    userService = module.get<UserService>(UserService);

    wallet1 = Wallet.createRandom();
    wallet2 = Wallet.createRandom();
    webUser = {
      profileId: '',
      username: 'aaa@moralis.io',
      password: 'moralispassword',
      address: Wallet.createRandom().address,
    };
    userService.createUser(webUser);
  });

  it('can hash data', () => {
    const password = 'moralis';
    const hashedPassword = userService.hashPassword(password);
    expect(hashedPassword).toEqual(
      createHash('sha256').update(password).digest('hex'),
    );
  });

  it('can create user', () => {
    const user = {
      profileId: '',
      username: 'bbb@moralis.io',
      password: 'moralispassword',
      address: '',
    };

    userService.createUser(user);
  });

  it('cannot create same username', () => {
    let message = '';

    try {
      [1, 2].forEach(() => {
        const user = {
          profileId: '',
          username: 'bbb@moralis.io',
          password: 'moralispassword',
          address: '',
        };

        userService.createUser(user);
      });
    } catch (error: any) {
      message = error.message;
    }

    expect(message).toEqual('Identity already registered');
  });

  it('cannot create same web3 address', () => {
    let message = '';

    try {
      [1, 2].forEach(() => {
        const user = {
          profileId: '',
          username: '',
          password: '',
          address: wallet1.address,
        };

        userService.createUser(user);
      });
    } catch (error: any) {
      message = error.message;
    }

    expect(message).toEqual('Identity already registered');
  });

  it('cannot create local if information insufficient', () => {
    let message = '';

    try {
      const user = {
        profileId: '',
        username: 'bbb@moralis.io',
        password: '',
        address: '',
      };

      userService.createUser(user);
    } catch (error: any) {
      message = error.message;
    }

    expect(message).toEqual('Insufficient information');
  });

  it('cannot create web3 auth if information insufficient', () => {
    let message = '';

    try {
      const user = {
        profileId: '',
        username: '',
        password: '',
        address: '',
      };

      userService.createUser(user);
    } catch (error: any) {
      message = error.message;
    }

    expect(message).toEqual('Insufficient information');
  });

  it('find user by local identity: should return identity', () => {
    const protectedWebUser = userService.findUserByLocal(
      webUser.username,
      webUser.password,
    );

    expect(protectedWebUser.username).toEqual(webUser.username);
    expect(protectedWebUser.address).toEqual(webUser.address);
  });

  it('find user by local identity: should not return any identity with wrong username', () => {
    const protectedWebUser = userService.findUserByLocal(
      webUser.username + '1',
      webUser.password,
    );

    expect(protectedWebUser).toBeNull();
  });

  it('find user by local identity: should not return any identity with wrong password', () => {
    const protectedWebUser = userService.findUserByLocal(
      webUser.username,
      webUser.password + '1',
    );

    expect(protectedWebUser).toBeNull();
  });

  it('find user by web3 identity: should return identity', () => {
    const protectedWebUser = userService.findUserByWeb3Auth(webUser.address);

    expect(protectedWebUser.username).toEqual(webUser.username);
    expect(protectedWebUser.address).toEqual(webUser.address);
  });

  it('find user by web3 identity: should not return any identity', () => {
    const protectedWebUser = userService.findUserByWeb3Auth(wallet2.address);

    expect(protectedWebUser).toBeNull();
  });

  afterAll(async () => {
    await module.close();
  });
});
