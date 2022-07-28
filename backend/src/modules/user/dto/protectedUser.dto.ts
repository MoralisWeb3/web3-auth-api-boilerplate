import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEthereumAddress, IsNotEmpty } from 'class-validator';
import { UserDto } from './user.dto';

export class ProtectedUserDto {
  constructor(user: UserDto) {
    return {
      profileId: user.profileId,
      address: user.address,
      username: user.username,
    };
  }
  @ApiProperty({
    type: String,
    required: true,
    description: 'Unique identifier with a length of 66 characters',
    example:
      '0xbfbcfab169c67072ff418133124480fea02175f1402aaa497daa4fd09026b0e1',
  })
  profileId: string;

  @ApiProperty({
    type: 'string',
    required: true,
    description: 'The address of the Non Fungible Token (NFT)',
    example:
      'https://lh3.googleusercontent.com/imU1YcAwy1P8FXCYRRtl9JYMvGUUDjXy3M9PvgiB4sd_FXKS87rFoeStgyB8Iq_LCkokgtGIv1IJq2cfVyN8x3Eyj3bA15oBEXYaog=w600',
  })
  @IsEthereumAddress()
  address?: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'johndoe',
    description: 'Username of the user.',
  })
  @IsNotEmpty()
  @IsEmail()
  username?: string;
}
