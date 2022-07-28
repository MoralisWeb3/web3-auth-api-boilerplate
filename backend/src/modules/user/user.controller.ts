import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwtAuth.guard';
import { ProtectedUserDto } from './dto/protectedUser.dto';

@UseGuards(JwtAuthGuard)
@Controller('user')
@ApiTags('user')
export class UserController {
  @Get()
  @ApiCreatedResponse({
    type: ProtectedUserDto,
    description: 'The user information',
  })
  @ApiOperation({ operationId: 'getUser' })
  getUser(@Req() req): ProtectedUserDto {
    return {
      profileId: req.user.profileId,
      username: req.user.username,
      address: req.user.address,
    };
  }
}
