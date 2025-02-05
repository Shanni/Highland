import { createConfig, http } from 'wagmi';
import { mainnet, optimism, arbitrum, base } from 'viem/chains';

export const SUPPORTED_CHAINS = [
  {
    ...mainnet,
    name: 'Ethereum',
    icon: '/chain-icons/eth.png'
  },
  {
    ...optimism,
    name: 'Optimism',
    icon: '/chain-icons/op.png'
  },
  {
    ...arbitrum,
    name: 'Arbitrum',
    icon: '/chain-icons/arb.png'
  },
  {
    ...base,
    name: 'Base',
    icon: '/chain-icons/base.png'
  }
];

// Updated Covalent chain names
export const CHAIN_TO_COVALENT_MAP = {
  [mainnet.id]: 'eth-mainnet',
  [optimism.id]: 'optimism-mainnet',
  [arbitrum.id]: 'arbitrum-mainnet',
  [base.id]: 'base-mainnet',
  'solana': 'solana-mainnet'
};

export const config = createConfig({
  chains: SUPPORTED_CHAINS,
  transports: {
    [mainnet.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  }
}); 