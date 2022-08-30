import axios from 'axios';
import {
  moralisWeb3ApiKey,
  moralisEvmApiUrl,
  moralisSolanaApiUrl,
} from '../../config/env';
import { Web3ApiRequestDto } from './dto/web3ApiRequest.dto';
import { buildQuery } from '../../config/utils';

export class NftService {
  async getNfts(
    address: string,
    web3ApiRequestDto: Web3ApiRequestDto,
  ): Promise<any> {
    if (!address) return [];

    const query = buildQuery(web3ApiRequestDto);
    let path = `${moralisSolanaApiUrl}/account/mainnet/${address}/nft`;
    if (address.startsWith('0x')) {
      path = `${moralisEvmApiUrl}/${address}/nft?${query}`;
    }
    const { data } = await axios.get(path, {
      headers: {
        'X-API-Key': moralisWeb3ApiKey,
      },
    });

    return data;
  }
}
