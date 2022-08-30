import { EChainId } from '../types/EChainId';
import { EEvmNetwork } from '../types/EEvmNetwork';
import { ESolanaNetwork } from '../types/ESolanaNetwork';

export interface ICompleteChallengeResponse {
  id: string;
  domain: string;
  network?: EEvmNetwork | ESolanaNetwork;
  chainId?: EChainId;
  address: string;
  statement?: string;
  uri: string;
  expirationTime?: string;
  notBefore?: string;
  resources?: Array<string>;
  version: string;
  nonce: string;
  profileId: string;
}
