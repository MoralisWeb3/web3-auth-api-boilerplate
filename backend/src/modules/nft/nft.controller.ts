import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwtAuth.guard';
import { GetNftsResponseDto } from './dto/getNftsResponse.dto';
import { Web3ApiRequestDto } from './dto/web3ApiRequest.dto';
import { NftService } from './nft.service';

@UseGuards(JwtAuthGuard)
@Controller('nft')
@ApiTags('nft')
export class NftController {
  constructor(private nftService: NftService) {}

  @Get()
  @ApiCreatedResponse({
    type: [GetNftsResponseDto],
    description: 'The NFTs that can be viewed by the client.',
  })
  @ApiOperation({ operationId: 'getNfts' })
  async getNfts(
    @Req() req,
    @Query() web3ApiRequest: Web3ApiRequestDto,
  ): Promise<GetNftsResponseDto> {
    return await this.nftService.getNfts(req.user.address, web3ApiRequest);
  }
}
