import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { ProtectedUserDto } from './dto/protectedUser.dto';
import { UserDto } from './dto/user.dto';

export class UserService {
  private users: UserDto[] = [];

  hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }

  createUser(user: UserDto): ProtectedUserDto {
    if (!((user.username && user.password) || user.address))
      throw new BadRequestException('Insufficient information');

    const duplicateUser = this.users.find((_user) => {
      if (user.address) {
        return user.address === _user.address;
      } else if (user.username) {
        return user.username === _user.username;
      } else {
        throw new BadRequestException('Insufficient information');
      }
    });

    if (duplicateUser)
      throw new ConflictException('Identity already registered');

    this.users.push({
      profileId: user.profileId,
      username: user.username,
      password: user.password ? this.hashPassword(user.password) : null,
      address: user.address,
    });

    return new ProtectedUserDto(user);
  }

  findUserByLocal(username: string, password: string): ProtectedUserDto {
    const hashedPassword = this.hashPassword(password);

    const user = this.users.find((user) => {
      return user.username === username && user.password === hashedPassword;
    });

    if (user) {
      return new ProtectedUserDto(user);
    } else {
      return null;
    }
  }

  findUserByWeb3Auth(address: string): ProtectedUserDto {
    const user = this.users.find((user) => {
      return user.address === address;
    });

    if (user) {
      return new ProtectedUserDto(user);
    } else {
      return null;
    }
  }

  updateUserByUsername(
    protectedUser: ProtectedUserDto,
    username: string,
  ): ProtectedUserDto {
    if (!username) throw new NotFoundException();
    const { username: excludedUsername, ...excludedUser } = protectedUser;

    const userIndex = this.users.findIndex((user) => {
      return username === user.username;
    });

    if (userIndex < 0) throw new NotFoundException('Unable to identify user');

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...excludedUser,
    };

    return new ProtectedUserDto(this.users[userIndex]);
  }
}
