import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useWalletData } from '../hooks/useWalletData';

const WalletConnect = () => {
  const { address, isConnected } = useAccount();
  const { connect, isLoading: isConnecting, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { walletData, isLoading: isLoadingData, error } = useWalletData(address, isConnected);

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
          disabled={isConnecting}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="wallet-info">
          <div className="wallet-details">
            <span className="wallet-address">
              {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
            </span>
            {isLoadingData ? (
              <span className="wallet-balance">Loading...</span>
            ) : error ? (
              <span className="wallet-balance error">Error loading data</span>
            ) : walletData && (
              <span className="wallet-balance">
                {walletData.balances?.items?.length || 0} tokens
              </span>
            )}
          </div>
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

export default WalletConnect; 