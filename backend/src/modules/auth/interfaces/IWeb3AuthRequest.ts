import { EChainId } from '../types/EChainId';
import { EEvmNetwork } from '../types/EEvmNetwork';
import { ESolanaNetwork } from '../types/ESolanaNetwork';

export interface IWeb3AuthRequest {
  network?: EEvmNetwork | ESolanaNetwork;
  chainId?: EChainId;
  address: string;
}
