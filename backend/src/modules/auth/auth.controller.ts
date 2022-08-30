import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CompleteWithEvmResponseDto } from './dto/completeWithEvmResponse.dto';
import { AuthWithLocalRequestDto } from './dto/authWithLocalRequest.dto';
import { AuthWithLocalResponseDto } from './dto/authWithLocalResponse.dto';
import { AuthWithEvmRequestDto } from './dto/authWithEvmRequest.dto';
import { AuthWithEvmResponseDto } from './dto/authWithEvmResponse.dto';
import { JwtAuthGuard } from '../../guards/jwtAuth.guard';
import { AuthWithSolanaResponseDto } from './dto/authWithSolanaResponse.dto';
import { AuthWithSolanaRequestDto } from './dto/authWithSolanaRequest.dto';
import { EBlockchainType } from '../../config/types';
import { CompleteWithSolanaResponseDto } from './dto/completeWithSolanaResponse.dto';
import { EvmCompleteChallengeRequestDto } from './dto/evm/evmCompleteChallengeRequest.dto';
import { SolanaCompleteChallengeRequestDto } from './dto/solana/solanaCompleteChallengeRequest.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signUp')
  @ApiCreatedResponse({
    type: AuthWithLocalResponseDto,
    description: 'Authentication token for user to access data.',
  })
  @ApiOperation({ operationId: 'signUp' })
  signUp(
    @Body() authLocalRequest: AuthWithLocalRequestDto,
  ): AuthWithLocalResponseDto {
    return this.authService.signUp(authLocalRequest);
  }

  @Post('/signIn')
  @ApiCreatedResponse({
    type: AuthWithLocalResponseDto,
    description: 'Authentication token for user to access data.',
  })
  @ApiOperation({ operationId: 'signIn' })
  signIn(
    @Body() authLocalRequest: AuthWithLocalRequestDto,
  ): AuthWithLocalResponseDto {
    return this.authService.signIn(authLocalRequest);
  }

  @Post('/signIn/evm')
  @ApiCreatedResponse({
    type: AuthWithEvmResponseDto,
    description:
      'EIP-4361 standard message to be signed by the client and passed to Auth API and a callback URL to submit signature and the signed message',
  })
  @ApiOperation({ operationId: 'signInWithEvm' })
  signInWithEvm(
    @Body() authWithEvmRequest: AuthWithEvmRequestDto,
  ): Promise<AuthWithEvmRequestDto | AuthWithSolanaResponseDto> {
    return this.authService.signInWithWeb3Auth(
      authWithEvmRequest,
      EBlockchainType.EVM,
    );
  }

  @Post('/signUp/evm')
  @ApiCreatedResponse({
    type: AuthWithEvmResponseDto,
    description:
      'EIP-4361 standard message to be signed by the client and passed to Auth API and a callback URL to submit signature and the signed message',
  })
  @ApiOperation({ operationId: 'signUpWithEvm' })
  signUpWithEvm(
    @Body() authWithEvmRequest: AuthWithEvmRequestDto,
  ): Promise<AuthWithEvmRequestDto | AuthWithSolanaResponseDto> {
    return this.authService.signUpWithWeb3Auth(
      authWithEvmRequest,
      EBlockchainType.EVM,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/link/evm')
  @ApiCreatedResponse({
    type: AuthWithEvmResponseDto,
    description:
      'EIP-4361 standard message to be signed by the client and passed to Auth API and a callback URL to submit signature and the signed message',
  })
  @ApiOperation({ operationId: 'linkWithEvm' })
  linkWithEvm(
    @Req() req,
    @Body() authWithEvmRequest: AuthWithEvmRequestDto,
  ): Promise<AuthWithEvmRequestDto | AuthWithSolanaResponseDto> {
    return this.authService.linkWithWeb3Auth(
      authWithEvmRequest,
      EBlockchainType.EVM,
      req.user,
    );
  }

  @Post('/complete/evm')
  @ApiCreatedResponse({
    type: CompleteWithEvmResponseDto,
    description:
      'A JWT token to be used to call the third party API from the client',
  })
  @ApiOperation({ operationId: 'completeWithEvm' })
  completeWithEvm(
    @Body() completeWithEvmRequest: EvmCompleteChallengeRequestDto,
  ): Promise<CompleteWithEvmResponseDto> {
    return this.authService.completeWithWeb3Auth(
      completeWithEvmRequest,
      EBlockchainType.EVM,
    );
  }

  @Post('/signIn/solana')
  @ApiCreatedResponse({
    type: AuthWithSolanaResponseDto,
    description:
      'Base58 encoded message to be signed by the client and passed to Auth API and a callback URL to submit signature and the signed message',
  })
  @ApiOperation({ operationId: 'signInWithSolana' })
  signInWithSolana(
    @Body() authWithSolanaRequest: AuthWithSolanaRequestDto,
  ): Promise<AuthWithEvmRequestDto | AuthWithSolanaResponseDto> {
    return this.authService.signInWithWeb3Auth(
      authWithSolanaRequest,
      EBlockchainType.SOLANA,
    );
  }

  @Post('/signUp/solana')
  @ApiCreatedResponse({
    type: AuthWithSolanaResponseDto,
    description:
      'Base58 encoded message to be signed by the client and passed to Auth API and a callback URL to submit signature and the signed message',
  })
  @ApiOperation({ operationId: 'signUpWithSolana' })
  signUpWithSolana(
    @Body() authWithSolanaRequest: AuthWithSolanaRequestDto,
  ): Promise<AuthWithEvmRequestDto | AuthWithSolanaResponseDto> {
    return this.authService.signUpWithWeb3Auth(
      authWithSolanaRequest,
      EBlockchainType.SOLANA,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/link/solana')
  @ApiCreatedResponse({
    type: AuthWithSolanaResponseDto,
    description:
      'Base58 encoded message to be signed by the client and passed to Auth API and a callback URL to submit signature and the signed message',
  })
  @ApiOperation({ operationId: 'linkWithSolana' })
  linkWithSolana(
    @Req() req,
    @Body() authWithSolanaRequest: AuthWithSolanaRequestDto,
  ): Promise<AuthWithEvmRequestDto | AuthWithSolanaResponseDto> {
    return this.authService.linkWithWeb3Auth(
      authWithSolanaRequest,
      EBlockchainType.SOLANA,
      req.user,
    );
  }

  @Post('/complete/solana')
  @ApiCreatedResponse({
    type: CompleteWithSolanaResponseDto,
    description:
      'A JWT token to be used to call the third party API from the client',
  })
  @ApiOperation({ operationId: 'completeWithSolana' })
  completeWithSolana(
    @Body() completeWithSolanaRequest: SolanaCompleteChallengeRequestDto,
  ): Promise<CompleteWithSolanaResponseDto> {
    return this.authService.completeWithWeb3Auth(
      completeWithSolanaRequest,
      EBlockchainType.SOLANA,
    );
  }
}
