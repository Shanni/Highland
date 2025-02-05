import { useState, useEffect } from 'react';
import { walletService } from '../services/walletService';
import { CHAIN_TO_COVALENT_MAP } from '../config/wagmi';

export const useWalletData = (address, isConnected, selectedChain) => {
  const [walletData, setWalletData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!address) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const chainName = CHAIN_TO_COVALENT_MAP[selectedChain.id || selectedChain];
        const [balances, activity] = await Promise.all([
          walletService.getWalletBalances(address, chainName),
          walletService.getWalletActivity(address, chainName)
        ]);
        
        setWalletData({
          balances,
          activity
        });
      } catch (error) {
        setError(error);
        console.error('Error fetching wallet data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isConnected) {
      fetchWalletData();
    } else {
      setWalletData(null);
      setError(null);
    }
  }, [address, isConnected, selectedChain]);

  return { walletData, isLoading, error };
}; 