import { useState, useEffect } from 'react';
import { createConfig, WagmiConfig, useAccount, useConnect, useDisconnect } from 'wagmi';
import { mainnet } from 'viem/chains';
import { createPublicClient, http } from 'viem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http()
  }
});

const WalletConnectButton = () => {
  const { address, isConnected } = useAccount();
  const { connect, isLoading, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = async () => {
    try {
      await connect({
        connector: connectors[0]
      });
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  return (
    <div>
      {!isConnected ? (
        <button 
          className="connect-wallet-btn"
          onClick={handleConnect}
          disabled={isLoading}
        >
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="wallet-info">
          <span className="wallet-address">
            {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
          </span>
          <button 
            className="disconnect-btn"
            onClick={() => disconnect()}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

const WalletConnect = () => {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletConnectButton />
      </QueryClientProvider>
    </WagmiConfig>
  );
};

export default WalletConnect; 