import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CompleteWithEthereumRequestDto } from './dto/completeWithEthereumRequest.dto';
import { CompleteWithEthereumResponseDto } from './dto/completeWithEthereumResponse.dto';
import { AuthLocalRequestDto } from './dto/authLocalRequest.dto';
import { AuthLocalResponseDto } from './dto/authLocalResponse.dto';
import { AuthWithEthereumRequestDto } from './dto/authWithEthereumRequest.dto';
import { AuthWithEthereumResponseDto } from './dto/authWithEthereumResponse.dto';
import { JwtAuthGuard } from '../../guards/jwtAuth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signUp')
  @ApiCreatedResponse({
    type: AuthLocalResponseDto,
    description: 'Authentication token for user to access data.',
  })
  @ApiOperation({ operationId: 'signUp' })
  async signUp(
    @Body() authLocalRequest: AuthLocalRequestDto,
  ): Promise<AuthLocalResponseDto> {
    return this.authService.signUp(authLocalRequest);
  }

  @Post('/signIn')
  @ApiCreatedResponse({
    type: AuthLocalResponseDto,
    description: 'Authentication token for user to access data.',
  })
  @ApiOperation({ operationId: 'signIn' })
  async signIn(
    @Body() authLocalRequest: AuthLocalRequestDto,
  ): Promise<AuthLocalResponseDto> {
    return this.authService.signIn(authLocalRequest);
  }

  @Post('/signInWithEthereum')
  @ApiCreatedResponse({
    type: AuthWithEthereumResponseDto,
    description:
      'The message to be signed by the client and passed to Auth API',
  })
  @ApiOperation({ operationId: 'signInWithEthereum' })
  async signInWithEthereum(
    @Body() authWithEthereumRequest: AuthWithEthereumRequestDto,
  ): Promise<AuthWithEthereumResponseDto> {
    return await this.authService.signInWithEthereum(authWithEthereumRequest);
  }

  @Post('/signUpWithEthereum')
  @ApiCreatedResponse({
    type: AuthWithEthereumResponseDto,
    description:
      'The message to be signed by the client and passed to Auth API',
  })
  @ApiOperation({ operationId: 'signUpWithEthereum' })
  async signUpWithEthereum(
    @Body() authWithEthereumRequest: AuthWithEthereumRequestDto,
  ): Promise<AuthWithEthereumResponseDto> {
    return await this.authService.signUpWithEthereum(authWithEthereumRequest);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/linkWithEthereum')
  @ApiCreatedResponse({
    type: AuthWithEthereumResponseDto,
    description:
      'The message to be signed by the client and passed to Auth API',
  })
  @ApiOperation({ operationId: 'linkWithEthereum' })
  async linkWithEthereum(
    @Req() req,
    @Body() authWithEthereumRequest: AuthWithEthereumRequestDto,
  ): Promise<AuthWithEthereumResponseDto> {
    return await this.authService.linkWithEthereum(
      authWithEthereumRequest,
      req.user,
    );
  }

  @Post('/completeWithEthereum')
  @ApiCreatedResponse({
    type: CompleteWithEthereumResponseDto,
    description:
      'The token to be used to call the third party API from the client',
  })
  @ApiOperation({ operationId: 'completeWithEthereum' })
  async completeWithEthereum(
    @Body() completeWithEthereumRequest: CompleteWithEthereumRequestDto,
  ): Promise<CompleteWithEthereumResponseDto> {
    return await this.authService.completeWithEthereum(
      completeWithEthereumRequest,
    );
  }
}
