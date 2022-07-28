import axios from 'axios';
import { moralisWeb3ApiKey, moralisWeb3ApiUrl } from '../../config/env';
import { Web3ApiRequestDto } from './dto/web3ApiRequest.dto';
import { buildQuery } from '../../config/utils';

export class NftService {
  async getNfts(
    address: string,
    web3ApiRequestDto: Web3ApiRequestDto,
  ): Promise<any> {
    const query = buildQuery(web3ApiRequestDto);
    if (address) {
      const { data } = await axios.get(
        `${moralisWeb3ApiUrl}/${address}/nft?${query}`,
        {
          headers: {
            'X-API-Key': moralisWeb3ApiKey,
          },
        },
      );

      return data;
    } else {
      return [];
    }
  }
}
