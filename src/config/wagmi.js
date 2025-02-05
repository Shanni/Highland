import { createConfig, http } from 'wagmi';
import { mainnet } from 'viem/chains';

export const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http()
  }
}); 